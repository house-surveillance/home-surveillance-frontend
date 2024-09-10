import { FC } from "react";
import Webcam from "react-webcam";

interface VideoCameraProps {
  webcamRef: React.RefObject<Webcam>;
}

export const VideoCamera: FC<VideoCameraProps> = ({ webcamRef }) => {
  return (
    <div className="bg-cyan-500 rounded-lg">
      <div className="p-2">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      </div>
    </div>
  );
};
