import { useEffect, useState } from "react";
import { getNotifications } from "../api/services/notifications";
import Chip from "../components/Chip";

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
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td className="flex justify-center px-4 py-2 border-b items-center">
                  <img
                    src={notification.imageUrl}
                    alt={notification.imageId}
                    className="w-16 h-16 object-cover rounded-md "
                  />
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {notification.message}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <Chip type={notification.type} />
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {new Date(notification.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
