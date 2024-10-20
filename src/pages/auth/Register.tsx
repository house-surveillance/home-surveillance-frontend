import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { Role } from "../../commons/types";
import { roles } from "../../commons/constants";
import Loader from "../../components/loader";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [residenceName, setResidenceName] = useState("");
  const [residenceAddress, setResidenceAddress] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(["ADMIN"]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }
    setLoading(true);
    try {
      await register(
        username,
        email,
        password,
        selectedRoles,
        fullName,
        image!,
        residenceName,
        residenceAddress,
        true
      );
      navigate("/login");
    } catch (error: Error | any) {
      alert("Something went wrong, please try again");
    } finally {
      setLoading(false);
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
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Admin Register
        </h2>
        {loading && <Loader />}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="image"
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
                id="image"
                name="image"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roles
            </label>
            <p className="text-sm text-gray-500">
              El usuario solo puede ADMIN y puede agregar ser SUPERVISOR.
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
                      role === "ADMIN" ? true : selectedRoles.includes(role)
                    }
                    onChange={(e) => {
                      if (role !== "ADMIN") {
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
                    disabled={role === "RESIDENT"}
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
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="residence-name"
              className="block text-sm font-medium text-gray-700"
            >
              Residence Name
            </label>
            <input
              type="text"
              id="residence-name"
              name="residence-name"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={residenceName}
              onChange={(e) => setResidenceName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="residence-address"
              className="block text-sm font-medium text-gray-700"
            >
              Residence Address
            </label>
            <input
              type="text"
              id="residence-address"
              name="residence-address"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={residenceAddress}
              onChange={(e) => setResidenceAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            You have already an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
