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
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    // Clear Errors
    setError("");
    try {
      const res = await axios({
        method: "PATCH", // ← uppercase here
        url: BASE_URL + "/profile/edit",
        data: {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      //   setError(err.response.data);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Container: items-stretch ensures columns match height */}
        <div className="flex flex-col md:flex-row justify-center items-stretch my-10 gap-10 w-full max-w-5xl px-4">
          {/* LEFT SIDE: Edit Form Card */}
          <div className="card bg-base-300 w-full md:w-96 shadow-xl border border-base-100">
            <div className="card-body flex flex-col">
              <h2 className="card-title justify-center text-2xl font-bold mb-4 text-primary">
                Edit Profile
              </h2>

              <div className="space-y-3 flex-grow">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-semibold">
                    First Name
                  </legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-semibold">
                    Last Name
                  </legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-semibold">
                    Photo URL
                  </legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Image link"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>

                <div className="flex gap-4">
                  <fieldset className="fieldset flex-1">
                    <legend className="fieldset-legend font-semibold">
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
                    <legend className="fieldset-legend font-semibold">
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
                  <legend className="fieldset-legend font-semibold">
                    About
                  </legend>
                  <textarea
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="Tell us about yourself..."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>
              </div>

              {error && (
                <div className="alert alert-error text-xs py-2 mt-2">
                  <span>{error}</span>
                </div>
              )}

              <div className="card-actions justify-center mt-6">
                <button
                  className="btn btn-primary w-full shadow-md"
                  onClick={saveProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Live Preview */}
          <div className="flex flex-col items-center w-full md:w-96">
            <h2 className="text-xl font-bold mb-4 text-secondary uppercase tracking-widest opacity-70">
              Live Preview
            </h2>
            {/* We wrap UserCard in a div that fills the remaining flex height */}
            <div className="w-full flex-grow flex flex-col">
              <UserCard
                user={{ firstName, lastName, photoUrl, age, gender, about }}
              />
            </div>
          </div>
        </div>

        {/* SUCCESS TOAST */}
        {showToast && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert alert-success shadow-lg">
              <div className="flex items-center gap-2">
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
                <span>Profile updated successfully!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditProfile;
