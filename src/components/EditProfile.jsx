import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

function EditProfile({ user }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios({
        method: "PATCH",
        url: BASE_URL + "/profile/edit",
        data: { firstName, lastName, photoUrl, age, gender, about },
        withCredentials: true,
      });

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      // Display the specific error message from your backend if available
      setError(
        err?.response?.data || "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-base-100 pb-10">
      {/* Main Responsive Grid */}
      <div className="flex flex-col lg:flex-row justify-center items-start my-6 md:my-10 gap-8 lg:gap-16 w-full max-w-6xl px-4">
        {/* LEFT SIDE: Edit Form */}
        <div className="card bg-base-300 w-full lg:max-w-md shadow-2xl borderborder-base-content/5 order-2 lg:order-1">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6 text-primary border-b border-base-content/10 pb-2">
              Profile Settings
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <legend className="text-base-content/60 font-semibold uppercase text-xs tracking-widest">
                    First Name
                  </legend>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="text-base-content/60 font-semibold uppercase text-xs tracking-widest">
                    Last Name
                  </legend>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="text-base-content/60 font-semibold uppercase text-xs tracking-widest">
                  Photo URL
                </legend>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary transition-all"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </fieldset>

              <div className="flex gap-4">
                <fieldset className="fieldset flex-1">
                  <legend className="text-base-content/60 font-semibold uppercase text-xs tracking-widest">
                    Age
                  </legend>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset flex-1">
                  <legend className="text-base-content/60 font-semibold uppercase text-xs tracking-widest">
                    Gender
                  </legend>
                  <select
                    className="select select-bordered w-full"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="text-base-content/60 font-semibold uppercase text-xs tracking-widest">
                  About
                </legend>
                <textarea
                  className="textarea textarea-bordered h-28 w-full focus:textarea-primary transition-all"
                  placeholder="Bio..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </fieldset>
            </div>

            {error && (
              <div className="alert alert-error text-sm mt-4 py-2 animate-bounce">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions mt-8">
              <button
                className={`btn btn-primary w-full shadow-lg ${loading ? "loading" : ""}`}
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Sticky Live Preview */}
        <div className="w-full lg:w-96 lg:sticky lg:top-24 self-start order-1 lg:order-2">
          <h2 className="text-sm font-black mb-4 text-secondary uppercase tracking-[0.2em] opacity-50 text-center lg:text-left">
            Live Preview
          </h2>
          <div className="hover:rotate-1 transition-transform duration-300">
            <UserCard
              user={{ firstName, lastName, photoUrl, age, gender, about }}
              showButtons={false}
            />
          </div>
          <p className="text-center text-xs mt-4 opacity-40 italic hidden lg:block">
            This is how other developers will see you.
          </p>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="toast toast-bottom md:toast-top toast-center z-[100]">
          <div className="alert alert-success shadow-2xl border border-white/10">
            <div className="flex items-center gap-3 font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Profile updated!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
