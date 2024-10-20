import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/auth";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const EditUserModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const [username, setUsername] = useState(data.userName ?? "");
  const [fullName, setFullName] = useState(data.profile.fullName ?? "");
  const [email, setEmail] = useState(data.email ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.profile?.imageUrl ?? null
  );

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      await updateUser(
        data.id,
        username,
        email,
        ["RESIDENT"],
        fullName,
        image!
      );
      navigate("/users");
      window.location.reload();
      onClose();
    } catch (error: Error | any) {
      alert("Something went wrong, please try again");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-7/12">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Add new user
        </h2>
        <form
          name="edit-user-form"
          className="space-y-4"
          onSubmit={handleUpdate}
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="image1"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Image
            </label>
            <div className="mt-1 flex items-center justify-center flex-col">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                  onClick={handleImageClick}
                />
              ) : (
                <span
                  className="inline-block h-20 w-20 overflow-hidden rounded-full bg-gray-100 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 24H0V0h24v24z" fill="none" />
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
              )}
              <span className="text-xs text-gray-500">{image?.name}</span>
              <input
                type="file"
                id="edit-image"
                name="edit-image"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-username"
              className="block text-sm font-medium text-gray-700"
            >
              User name
            </label>
            <input
              type="text"
              id="edit-username"
              name="edit-username"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="edit-fullName"
              name="edit-fullName"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="edit-email"
              name="edit-email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="flex gap-1">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>

            <button
              type="button"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
