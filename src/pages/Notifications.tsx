import { useEffect, useState } from "react";
import {
  deleteNotification,
  getNotifications,
} from "../api/services/notifications";
import Chip from "../components/Chip";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response);
      } catch (error: Error | any) {
        console.error(error?.message ?? "Error fetching notifications");
      }
    };

    fetchNotifications();
  }, []);

  const delete_notification = async (id: string) => {
    try {
      const response = await deleteNotification(id);
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
      } else {
        alert("Error deleting notification, try later");
      }
    } catch (_) {
      alert("Error deleting notification, try later");
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Message</th>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Timestamp</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td className="flex justify-center  p-2 border-b items-center">
                  <img
                    src={notification.imageUrl}
                    alt={notification.imageId}
                    width={164}
                    height={64}
                    className="w-36 h-24 object-cover rounded-md "
                  />
                </td>
                <td className="p-2 border-b text-center">
                  {notification.message}
                </td>
                <td className="p-2 border-b text-center">
                  <Chip type={notification.type} />
                </td>
                <td className="p-2 border-b text-center">
                  {new Date(notification.timestamp).toLocaleString()}
                </td>
                <td className="p-2 border-b text-center">
                  <button
                    className="text-red-800"
                    onClick={() => delete_notification(notification.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
