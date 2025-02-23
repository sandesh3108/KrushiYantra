import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Ensure correct path

const MainPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Redirect to landing page if no token exists
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="pt-26 xl:pt-26">
      <Outlet />
    </div>
  );
};

export default MainPage;
