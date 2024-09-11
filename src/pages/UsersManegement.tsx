import { useEffect, useState } from "react";
import { getUsers } from "../api/services/user";

export default function UsersManegement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error: Error | any) {
        console.error(error?.message ?? "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col justify-start p-52 w-full h-svh">
      <h1 className="text-2xl font-semibold p-5">Users Management</h1>
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

              <button
                className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded"
                // onClick={() => handleRegisterFace(user.id)}
              >
                register face
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
