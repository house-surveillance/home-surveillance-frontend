import { useEffect, useState } from "react";
import { getUsers } from "../api/services/user";
import ImageUploadModal from "../components/ImagesUploadModal";
import { registerFaceToModel } from "../api/services/recognition";
import NewUserModal from "../components/NewUserModal";

export default function UsersManegement() {
  const [users, setUsers] = useState([]);
  const [faces, setFaces] = useState<File[]>([]);
  const cleanFaces = () => {
    setFaces([]);
  };

  const registerFace = async (userId: string) => {
    if (faces.length === 0 || faces.length < 4) {
      cleanFaces();
      alert("4 images are required to register a face");
      return;
    }
    const formData = new FormData();
    formData.append("userID", userId);

    for (const file of faces) {
      if (!file) {
        cleanFaces();
        alert("Please select 4 images");
        return;
      }
      formData.append("files", file);
    }

    try {
      await registerFaceToModel(formData);
      alert("Faces registered successfully");
      cleanFaces();
      window.location.reload();
    } catch (error: any) {
      cleanFaces();
      console.error("Error registering faces:", error);
      alert(error?.message ?? "Error registering faces");
    }
  };

  const [modals, setModals] = useState({
    faceRegister: {
      isOpen: false,
      handleOpen: () => {
        setModals((prevModals) => ({
          ...prevModals,
          faceRegister: { ...prevModals.faceRegister, isOpen: true },
        }));
      },
      onClose: () => {
        setModals((prevModals) => ({
          ...prevModals,
          faceRegister: { ...prevModals.faceRegister, isOpen: false },
        }));
      },
    },
    newUser: {
      isOpen: false,
      handleOpen: () => {
        setModals((prevModals) => ({
          ...prevModals,
          newUser: { ...prevModals.newUser, isOpen: true },
        }));
      },
      onClose: () => {
        setModals((prevModals) => ({
          ...prevModals,
          newUser: { ...prevModals.newUser, isOpen: false },
        }));
      },
    },
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        console.log("🚀 ~ fetchUsers ~ response:", response)
        setUsers(response);
      } catch (error: Error | any) {
        console.error(error?.message ?? "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col justify-start py-44 px-20  w-full h-svh">
      <div className="flex  justify-between items-center">
        <h1 className="text-2xl font-semibold p-5">Users Management</h1>
        <button
          className="px-2 h-10 text-xs font-semibold text-white bg-blue-500 rounded"
          onClick={() => modals.newUser.handleOpen()}
        >
          new user
        </button>
      </div>
      {users.map((user: any) => (
        <div
          key={user.id}
          className="flex justify-between gap-x-6 p-2 border-b-2 "
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={user.profile.imageUrl}
              alt="user image profile"
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {user.profile.fullName}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-cyan-700">
              {user?.roles?.join(", ")?.toLowerCase()}.
            </p>

            {user?.profile?.status === "VERIFIED" ? (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <p className="text-xs leading-5 text-gray-500">
                  {user?.profile?.status}
                </p>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-green-800 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                </div>
                <p className="text-xs leading-5 text-gray-500">
                  {user?.profile?.status}
                </p>
              </div>
            )}

            <div className="mt-2 flex gap-x-2">
              <button
                className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded"
                //onClick={() => handleEdit(user.id)}
              >
                Update
              </button>
              <ImageUploadModal
                userId={user.id.toString()}
                isOpen={modals.faceRegister.isOpen}
                onClose={modals.faceRegister.onClose}
                images={faces}
                registerFace={registerFace}
                setImages={setFaces}
              />

              <NewUserModal
                isOpen={modals.newUser.isOpen}
                onClose={modals.newUser.onClose}
              />

              {user?.profile?.status === "UNVERIFIED" && (
                <button
                  className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded"
                  onClick={() => modals.faceRegister.handleOpen()}
                >
                  register face
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
