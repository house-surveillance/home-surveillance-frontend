import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const NotificationAlert = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on(
      "notification",
      (notification: { type: string; message: string }) => {
        const { type, message } = notification;

        toast(
          message,
          {
            type: type === "Verified" ? "success" : "error",
            autoClose: 700,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    );

    return () => {
      socket.off("connect");
      socket.off("notification");
    };
  }, []);

  return (
    <div>
      <ToastContainer limit={1} />
    </div>
  );
};

export default NotificationAlert;
