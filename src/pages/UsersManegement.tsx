import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../api/services/user";
import ImageUploadModal from "../components/ImagesUploadModal";
import { registerFaceToModel } from "../api/services/recognition";
import NewUserModal from "../components/NewUserModal";
import {
  CameraIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import EditUserModal from "../components/EditUser";
import Loader from "../components/loader";

export default function UsersManegement() {
  const [users, setUsers] = useState([]);
  const [faces, setFaces] = useState<File[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const cleanFaces = () => {
    setFaces([]);
  };

  const user = JSON.parse(sessionStorage?.getItem("user") ?? "");
  const isAdmin = user?.roles?.includes("ADMIN");
  const userId = user?.id;

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

    setLoading(true);
    try {
      await registerFaceToModel(formData);
      alert("Faces registered successfully");
      cleanFaces();
      window.location.reload();
    } catch (error: any) {
      cleanFaces();
      console.error("Error registering faces:", error);
      alert(error?.message ?? "Error registering faces");
    } finally {
      setLoading(false);
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
    editUser: {
      isOpen: false,
      handleOpen: () => {
        setModals((prevModals) => ({
          ...prevModals,
          editUser: { ...prevModals.editUser, isOpen: true },
        }));
      },
      onClose: () => {
        setModals((prevModals) => ({
          ...prevModals,
          editUser: { ...prevModals.editUser, isOpen: false },
        }));
      },
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(userId);
        setUsers(response);
      } catch (error: Error | any) {
        console.error(error?.message ?? "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  async function deteleUser(id: any) {
    try {
      const newUsers = users.filter((user: any) => user.id !== id);
      const response = await deleteUser(id);
      if (response.status === 200) {
        alert("User deleted successfully");
        setUsers([...newUsers]);
      } else {
        alert("Error deleting user, try later");
      }
    } catch (error: Error | any) {
      console.error(error?.message ?? "Error deleting user");
    }
  }
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    modals.editUser.handleOpen();
  };

  const handleFaceRegister = (user: any) => {
    setSelectedUser(user);
    modals.faceRegister.handleOpen();
  };

  return (
    <div className="flex flex-col justify-start py-44 px-20  w-full h-svh">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-semibold p-5 bg-cyan-400 rounded-md">
          {user?.residence?.name}
        </h2>
        <h3 className="text-xl font-semibold p-5 text-gray-500">
          {user?.residence?.address}
        </h3>
      </div>
      <div className="flex  justify-between items-center">
        <h1 className="text-2xl font-semibold p-5">Users Management</h1>
        <button
          className="px-2 h-10 text-xs font-semibold text-blue-700 rounded"
          onClick={() => modals.newUser.handleOpen()}
          hidden={!isAdmin}
        >
          <UserPlusIcon className="w-5 h-5" />
        </button>
      </div>
      {loading && <Loader />}

      {users.map((user: any) => (
        <div
          key={crypto.randomUUID()}
          className="flex justify-between gap-x-6 p-2 border-b-2 "
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-16 w-16 flex-none rounded-full bg-gray-50"
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
                <div className="flex-none rounded-full bg-red-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                </div>
                <p className="text-xs leading-5 text-gray-500">
                  {user?.profile?.status}
                </p>
              </div>
            )}

            <div className="mt-1 flex gap-x-2">
              {(isAdmin || userId === user.id) && (
                <button
                  className="px-2 py-1 text-xs font-semibold  text-green-700 rounded"
                  onClick={() => handleEditUser(user)}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              )}

              {user?.profile?.status === "UNVERIFIED" &&
                (isAdmin || userId === user.id) && (
                  <button
                    className="px-2 py-1 text-xs font-semibold text-blue-700 rounded"
                    onClick={() => handleFaceRegister(user)}
                  >
                    <CameraIcon className="h-5 w-5" />
                  </button>
                )}
              {isAdmin && (
                <button
                  className="p1 text-xs font-semibold text-red-700 rounded"
                  onClick={() => deteleUser(user.id)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {modals.faceRegister.isOpen && selectedUser && (
        <ImageUploadModal
          userId={selectedUser.id.toString()}
          isOpen={modals.faceRegister.isOpen}
          onClose={modals.faceRegister.onClose}
          images={faces}
          registerFace={registerFace}
          setImages={setFaces}
        />
      )}

      {modals.newUser.isOpen && (
        <NewUserModal
          isOpen={modals.newUser.isOpen}
          onClose={modals.newUser.onClose}
        />
      )}

      {modals.editUser.isOpen && selectedUser && (
        <EditUserModal
          isOpen={modals.editUser.isOpen}
          onClose={modals.editUser.onClose}
          data={selectedUser}
        />
      )}
    </div>
  );
}
