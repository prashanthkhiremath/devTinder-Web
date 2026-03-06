import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUserFromFeed } from "../utils/feedSlice";

function UserCard({ user, showButtons = true }) {
  // Destructure with fallbacks to avoid crashes
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      // 1. Trigger the API call
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );

      // 2. Dispatch to Redux (moved outside the axios call)
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request failed:", err?.response?.data || err.message);
    }
  };

  return (
    <div className="card bg-base-300 w-80 md:w-96 shadow-2xl border border-white/5 transition-all hover:border-primary/40 hover:shadow-primary/20">
      {/* Figure with fixed aspect ratio for consistent card heights */}
      <figure className="h-80 w-full overflow-hidden bg-base-200">
        <img
          src={photoUrl || "https://via.placeholder.com/400x400?text=No+Photo"}
          alt={`${firstName}'s profile`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </figure>

      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          {age && <div className="badge badge-outline mt-1">{age}</div>}
        </div>

        {gender && (
          <p className="text-xs uppercase font-bold tracking-widest opacity-60">
            {gender}
          </p>
        )}

        <p className="mt-2 text-sm line-clamp-3 min-h-[3rem]">
          {about || "This developer hasn't filled out their bio yet."}
        </p>

        {showButtons && (
          <div className="card-actions justify-center mt-6 gap-4">
            <button
              className="btn btn-ghost border-base-content/20 flex-1 hover:btn-error"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary flex-1 shadow-lg"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;
