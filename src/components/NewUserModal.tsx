import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { Role } from "../commons/types";
import { roles } from "../commons/constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewUserModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("Nuevo" + Date.now());

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(["RESIDENT"]);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const admin = JSON.parse(sessionStorage.getItem("user") ?? "");

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      const adminId = admin?.id;
      if (!adminId) return;

      await register(
        username,
        email,
        password,
        selectedRoles,
        fullName,
        image!,
        "0",
        "0",
        false,
        adminId
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
          Add new user resident
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
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
                id="image1"
                name="image1"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              user Name
            </label>
            <input
              type="text"
              id="username1"
              name="username1"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roles
            </label>
            <p className="text-sm text-gray-500">
              El usuario a crear solo puede RESIDENT y puede agregar ser
              SUPERVISOR.
            </p>
            <div className="mt-2 space-y-2">
              {roles.map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    id={role}
                    name="roles"
                    type="checkbox"
                    value={role}
                    checked={
                      role === "RESIDENT" ? true : selectedRoles.includes(role)
                    }
                    onChange={(e) => {
                      if (role !== "RESIDENT") {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, role]);
                        } else {
                          setSelectedRoles(
                            selectedRoles.filter((r) => r !== role)
                          );
                        }
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={role === "ADMIN"}
                  />
                  <label htmlFor={role} className="ml-2 text-sm text-gray-700">
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="fullName1"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName1"
              name="fullName1"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="email1"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email1"
              name="email1"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="password1"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password1"
              name="password1"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

export default NewUserModal;
