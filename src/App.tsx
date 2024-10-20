import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/layout";

import NotFoundPage from "./pages/NotFoundPage";
import RealTimeFacialRecognition from "./pages/RealTimeFacialRecognition";
import UsersManegement from "./pages/UsersManegement";
import Notifications from "./pages/Notifications";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import WelcomePage from "./pages/WelcomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<RealTimeFacialRecognition />} />
          <Route path="/users" element={<UsersManegement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
