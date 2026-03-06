import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    /* flex-col and min-h-screen keep the footer at the bottom */
    <div className="flex flex-col min-h-screen bg-base-100 transition-colors duration-300">
      <NavBar />

      {/* flex-grow allows the Outlet to take up all available space.
         pb-20 adds padding at the bottom so content isn't hidden by a fixed footer on mobile.
      */}
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Body;
