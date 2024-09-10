import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-gray-600">404 Not Found</h1>
      <Link to="/" className="text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
}
