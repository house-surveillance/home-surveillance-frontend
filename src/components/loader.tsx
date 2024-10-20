import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="w-full h-2 bg-gray-200">
      <div className="h-full bg-blue-500 animate-pulse"></div>
    </div>
  );
};

export default Loader;
