import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      // Added await here to ensure the request completes
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      // Remove from local state after successful API call
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  // Fixed the logic: if length is 0, show the empty state
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] opacity-50">
        <h1 className="text-2xl font-bold">No Pending Requests</h1>
        <p>Check back later for new connections!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-black text-center mb-10 tracking-tight">
        Connection Requests
      </h1>

      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className="flex flex-col md:flex-row items-center bg-base-300 p-6 rounded-2xl shadow-lg border border-base-100 hover:border-primary/30 transition-all gap-6"
            >
              {/* Profile Photo */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt="profile"
                    className="object-cover"
                    src={photoUrl || "https://via.placeholder.com/150"}
                  />
                </div>
              </div>

              {/* User Details */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {firstName} {lastName}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1 mb-2">
                  {age && (
                    <span className="badge badge-outline">{age} years</span>
                  )}
                  {gender && (
                    <span className="badge badge-secondary badge-outline capitalize">
                      {gender}
                    </span>
                  )}
                </div>
                <p className="opacity-80 italic line-clamp-2">
                  {about || "No bio available."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  className="btn btn-error btn-outline flex-1 md:flex-none px-8"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-primary flex-1 md:flex-none px-8 shadow-md"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
