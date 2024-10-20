import { useState, useRef } from "react";

interface ModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  images: File[];
  registerFace: (userId: string) => void;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageUploadModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  images,
  setImages,
  registerFace,
  userId,
}) => {
  const [imagesPreview, setImagesPreview] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const cleanImagesPreview = () => {
    setImagesPreview([null, null, null, null]);
  };

  const closeModal = () => {
    setImages([]);
    cleanImagesPreview();
    onClose();
  };

  const handleImageChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (
        file?.name.split(".").pop()?.toLocaleLowerCase() !== "jpg" &&
        file?.name.split(".").pop()?.toLocaleLowerCase() !== "png" &&
        file?.name.split(".").pop()?.toLocaleLowerCase() !== "jpeg"
      ) {
        alert("The file must be a jpg or png image");
        return;
      }
      if (file) {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImagesPreview = [...imagesPreview];
          newImagesPreview[index] = reader.result as string;
          setImagesPreview(newImagesPreview);
        };
        reader.readAsDataURL(file);
      }
    };

  const handleImageClick = (index: number) => () => {
    fileInputRefs.current[index]?.click();
  };

  const handleSubmit = async () => {
    registerFace(userId);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Regiter Face</h2>
        <p className="text-sm text-gray-500">
          1. Please select 4 images to register the face.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          2. Please select a clear image of the face.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Please select the following images: a front face, a left profile, a
          right profile, and a top view.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Following these steps will help the system to recognize the face
          better.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {imagesPreview.map((image, index) => (
            <div key={index} className="relative">
              {image ? (
                <img
                  src={image as string}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded cursor-pointer"
                  onClick={handleImageClick(index)}
                />
              ) : (
                <div
                  className="w-full h-32 flex items-center justify-center bg-gray-100 rounded cursor-pointer"
                  onClick={handleImageClick(index)}
                >
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 2H4v10h12V5zM8 7a1 1 0 100 2h4a1 1 0 100-2H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                ref={(el) => (fileInputRefs.current[index] = el)}
                onChange={handleImageChange(index)}
                accept="image/*"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Register
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
