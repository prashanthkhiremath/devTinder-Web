import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize theme from localStorage or default to "dark"
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark",
  );

  // Apply theme to the <html> tag whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const themes = ["light", "dark", "cupcake"];

  return (
    <div className="navbar bg-base-300 shadow-lg px-4 md:px-8 sticky top-0 z-50 border-b border-base-content/10">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold italic tracking-tighter"
        >
          👩‍💻 DEV<span className="text-primary">tinder</span>
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {/* THEME SELECTOR */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm md:btn-md btn-outline btn-primary"
          >
            Theme
            <svg
              width="12px"
              height="12px"
              className="h-2 w-2 fill-current opacity-60 inline-block ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 mt-4 max-h-96 overflow-y-auto border border-base-content/10"
          >
            {themes.map((t) => (
              <li key={t}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={t.charAt(0).toUpperCase() + t.slice(1)}
                  value={t}
                  checked={theme === t}
                  onChange={() => setTheme(t)}
                />
              </li>
            ))}
          </ul>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:block font-medium opacity-80">
              Welcome, {user?.firstName}
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar online"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt="user photo"
                    src={
                      user.photoUrl ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-base-content/10"
              >
                <li>
                  <Link to="/profile" className="py-3">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="py-3">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="py-3">
                    Requests
                  </Link>
                </li>
                <div className="divider my-0 opacity-20"></div>
                <li>
                  <a
                    onClick={handleLogout}
                    className="text-error font-bold py-3"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
