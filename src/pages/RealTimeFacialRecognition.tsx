import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { VideoCamera } from "../components/VideoCamera";
import { getUsers } from "../api/services/user";
import { registerNotification } from "../api/services/notifications";

export default function RealTimeFacialRecognition() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [usersDetected, setUsersDetected] = useState<string[]>([]);

  const [fcmTokens, setFcmTokens] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [notificationQueue, setNotificationQueue] = useState<any[]>([]);

  const [lastNotificationTimes, setLastNotificationTimes] = useState<{
    [key: string]: number;
  }>({});

  const userLoggedIn = JSON.parse(sessionStorage?.getItem("user") ?? "");

  useEffect(() => {
    console.log(lastNotificationTimes);
    const fetchUsers = async () => {
      try {
        const response = await getUsers(userLoggedIn?.id);
        const dataMapped = response.map((user: any) => {
          return {
            fullName: user.profile.fullName,
            id: user.id,
            face: user?.face?.labeledDescriptors
              ? JSON.parse(user?.face?.labeledDescriptors)
              : null,
          };
        });

        setFcmTokens(
          response.map((user: any) => user.fcmToken).filter(Boolean)
        );

        setUsers(dataMapped);
      } catch (error: Error | any) {
        console.error(error?.message ?? "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (error: Error | any) {
        console.error(error?.message ?? "Error loading models");
      }
    };
    loadModels();
  }, []);

  const sendNotification = async (type: string, label: string, image: File) => {
    try {
      const response = await registerNotification(
        type,
        label,
        image,
        fcmTokens
      );

      if (response.ok) {
      } else {
        console.error("Error sending notification");
      }
    } catch (error: Error | any) {
      console.error(error?.message ?? "Error sending notification");
    }
  };

  const captureImage = (): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      if (webcamRef.current) {
        const canvas = document.createElement("canvas");
        const video = webcamRef.current.video as HTMLVideoElement;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.png", { type: "image/png" });
            resolve(file);
          } else {
            reject(new Error("Failed to capture image"));
          }
        }, "image/png");
      } else {
        resolve(null);
      }
    });
  };

  useEffect(() => {
    const processQueue = async () => {
      if (notificationQueue.length > 0) {
        const { type, image, label } = notificationQueue[0];
        await sendNotification(type, label, image);
        setNotificationQueue((prev) => prev.slice(1));
      }
    };

    if (notificationQueue.length > 0) {
      processQueue();
    }
  }, [notificationQueue]);

  const detectFace = async () => {
    setUsersDetected([]);

    if (webcamRef.current) {
      const video = webcamRef.current.video as HTMLVideoElement;
      const detections = await faceapi
        .detectAllFaces(
          video

          // new faceapi.TinyFaceDetectorOptions({
          //   scoreThreshold: 0.1,
          //   inputSize: 128,
          // })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      const distanceThreshold = 0.6;

      if (detections.length > 0) {
        const labeledFaceDescriptors = users?.map((user: any) => {
          const labeledDescriptorsJson = user.face;
          if (!labeledDescriptorsJson) return null;

          const modifiedDescriptors = labeledDescriptorsJson.map(
            (labelDescriptor: any) => {
              const descriptors = labelDescriptor.descriptors.map(
                (descriptor: any) => new Float32Array(descriptor)
              );
              return {
                ...labelDescriptor,
                descriptors: descriptors,
              };
            }
          );
          return new faceapi.LabeledFaceDescriptors(
            user.face?.[0]?.label.toString(),
            modifiedDescriptors.flatMap(
              (labelDescriptor: any) => labelDescriptor.descriptors
            )
          );
        });

        const recognizer = new faceapi.FaceMatcher(
          labeledFaceDescriptors.filter(Boolean),
          distanceThreshold
        );

        detections.forEach((detection) => {
          const bestMatch = recognizer.findBestMatch(detection.descriptor);
          if (bestMatch) {
            const matchedUser = users.find(
              (user) => user.face?.[0]?.label.toString() === bestMatch.label
            );

            if (matchedUser) {
              const detectedLabel = matchedUser
                ? matchedUser.fullName ?? "unknown"
                : "unknown";

              setLastNotificationTimes((prevTimes) => {
                const currentTime = Date.now();
                const lastNotificationTime = prevTimes[detectedLabel] || 0;
                const time = detectedLabel === "unknown" ? 10000 : 120000;
                if (currentTime - lastNotificationTime > time) {
                  captureImage()
                    .then((image) => {
                      if (image) {
                        setNotificationQueue((prev) => [
                          ...prev,
                          {
                            type: detectedLabel ? `Verified` : `Unverified`,
                            image,
                            label: detectedLabel,
                            currentTime,
                          },
                        ]);
                      }
                    })
                    .catch((error) => {
                      console.error("Error capturing image:", error);
                    });

                  return {
                    ...prevTimes,
                    [detectedLabel]: currentTime,
                  };
                }

                return prevTimes;
              });

              setUsersDetected((prev) => [...prev, detectedLabel]);
            } else {
              setLastNotificationTimes((prevTimes) => {
                const currentTime = Date.now();
                const lastNotificationTime = prevTimes["unknown"] || 0;

                if (currentTime - lastNotificationTime > 10000) {
                  captureImage()
                    .then((image) => {
                      if (image) {
                        setNotificationQueue((prev) => [
                          ...prev,
                          {
                            type: `Not Verified`,
                            image,
                            label: "unknown",
                            currentTime,
                          },
                        ]);
                      }
                    })
                    .catch((error) => {
                      console.error("Error capturing image:", error);
                    });

                  return {
                    ...prevTimes,
                    ["unknown"]: currentTime,
                  };
                }

                return prevTimes;
              });
              setUsersDetected((prev) => {
                return [...prev, "unknown"];
              });
            }
          }
        });
      } else {
        console.warn("No detections found.");
      }
    }
  };

  useEffect(() => {
    if (!isModelLoaded) return;
    const interval = setInterval(detectFace, 1500);
    return () => clearInterval(interval);
  }, [isModelLoaded]);

  return (
    <div className="flex flex-row justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl text-gray-600 p-2">
          Real Time Facial Recognition
        </h2>
        <VideoCamera webcamRef={webcamRef} />
      </div>

      <div className="ml-4 flex flex-col items-start ">
        <h3 className="text-2xl text-gray-600 mb-2">Usuarios Detectados 🧑‍🤝‍🧑:</h3>
        <div className="overflow-y-auto max-h-96">
          {usersDetected.length > 0 ? (
            usersDetected.map((user) => (
              <div key={crypto.randomUUID()} className="text-lg text-gray-600">
                {user}
              </div>
            ))
          ) : (
            <div className="text-lg text-gray-600">No faces in video</div>
          )}
        </div>
      </div>
    </div>
  );
}
