import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { VideoCamera } from "../components/VideoCamera";
import { getUsers } from "../api/services/user";

export default function RealTimeFacialRecognition() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [usersDetected, setUsersDetected] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  console.log("🚀 ~ RealTimeFacialRecognition ~ users:", users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        const dataMapped = response.map((user: any) => {
          return {
            fullName: user.profile.fullName,
            id: user.id,
            face: user?.face?.labeledDescriptors
              ? JSON.parse(user?.face?.labeledDescriptors)
              : [],
          };
        });

        setUsers(dataMapped);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        console.log("Cargando modelos desde: ", MODEL_URL);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (error) {}
    };
    loadModels();
  }, []);

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
        const labeledFaceDescriptors = users.map((user: any) => {
          const labeledDescriptorsJson = user.face;

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
          labeledFaceDescriptors,
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
              setUsersDetected((prev) => [...prev, detectedLabel]);
            } else {
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
    const interval = setInterval(detectFace, 1000);
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
