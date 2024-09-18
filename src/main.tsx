
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

/*
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Pene from "./pages/indes.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/pinga",
//     element: <Pene />,
//     errorElement: <NotFoundPage />,
//   },
// ]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

*/
