import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/layout";

import NotFoundPage from "./pages/NotFoundPage";
import RealTimeFacialRecognition from "./pages/RealTimeFacialRecognition";
import UsersManegement from "./pages/UsersManegement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RealTimeFacialRecognition />} />
          <Route path="/users" element={<UsersManegement />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
