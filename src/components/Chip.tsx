import React from "react";

interface ChipProps {
  type: string;
}

const Chip: React.FC<ChipProps> = ({ type }) => {
  const isVerified = type === "Verified";
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {type === "Verified" ? "Verified" : "Unkown"}
    </span>
  );
};

export default Chip;
