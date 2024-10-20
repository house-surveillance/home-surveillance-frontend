import React, { FC } from "react";
import Webcam from "react-webcam";

interface VideoCameraProps {
  webcamRef: React.RefObject<Webcam>;
  className?: string;
}

export const VideoCamera: FC<VideoCameraProps> = ({ webcamRef, className }) => {
  return (
    <div className={`bg-cyan-500 rounded-lg ${className}`}>
      <div className="p-2 w-full">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};
