import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

function Profile() {
  // Access the current user from the global Redux store
  const user = useSelector((store) => store.user);

  /**
   * If user data isn't available yet (e.g., during initial load),
   * we show a clean loading state instead of a blank screen.
   */
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <EditProfile user={user} />
    </div>
  );
}

export default Profile;
