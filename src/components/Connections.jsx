import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { useEffect } from "react";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections)
    return (
      <div className="flex justify-center my-10">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center my-20 opacity-50">
        <h1 className="text-2xl font-bold">No Connections Found</h1>
        <p>Keep swiping to meet new people!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left border-b border-base-300 pb-4">
        Your Connections ({connections.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center p-4 rounded-2xl bg-base-200 shadow-sm border border-base-content/5 transition-all hover:shadow-md hover:bg-base-300 active:scale-95 cursor-pointer group"
            >
              <div className="avatar online">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt={`${firstName}'s photo`}
                    className="object-cover"
                    src={photoUrl}
                  />
                </div>
              </div>

              <div className="flex-grow ml-6">
                <h2 className="font-bold text-lg md:text-xl capitalize text-base-content">
                  {firstName + " " + lastName}
                </h2>
                <div className="flex gap-2 text-xs md:text-sm text-base-content/60 font-medium">
                  {age && <span>{age} yrs</span>}
                  {age && gender && <span>•</span>}
                  {gender && <span className="capitalize">{gender}</span>}
                </div>
                <p className="text-sm mt-1 line-clamp-1 text-base-content/70 italic">
                  {about || "No bio available"}
                </p>
              </div>

              {/* Chat Button - Primary color highlight on hover */}
              <div className="hidden sm:block">
                <button className="btn btn-ghost btn-circle group-hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
