import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    setLoading(true);
    const endpoint = isLoginForm ? "/login" : "/signup";
    const payload = isLoginForm
      ? { emailId, password }
      : { firstName, lastName, emailId, password };

    try {
      const res = await axios.post(BASE_URL + endpoint, payload, {
        withCredentials: true,
      });

      // Handle the data structure difference between login/signup res
      const userData = isLoginForm ? res.data : res.data.data;
      dispatch(addUser(userData));

      navigate(isLoginForm ? "/" : "/profile");
    } catch (err) {
      setError(
        err?.response?.data || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Allow user to press "Enter" to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAuth();
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="card bg-base-300 w-full max-w-sm shadow-2xl border border-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold text-primary mb-4">
            {isLoginForm ? "Welcome Back" : "Create Account"}
          </h2>

          <div className="space-y-2" onKeyDown={handleKeyDown}>
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </div>
            )}

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Address</legend>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="developer@gmail.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>

          {error && (
            <div className="alert alert-error py-2 mt-4 text-sm shadow-md">
              <span>{error}</span>
            </div>
          )}

          <div className="card-actions justify-center mt-6">
            <button
              className={`btn btn-primary btn-block shadow-lg ${loading ? "loading" : ""}`}
              onClick={handleAuth}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isLoginForm
                  ? "Login"
                  : "Join Community"}
            </button>
          </div>

          <div className="divider opacity-50 text-xs">OR</div>

          <p
            className="text-center text-sm cursor-pointer hover:text-primary transition-colors font-medium"
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              setError(""); // Clear error when switching forms
            }}
          >
            {isLoginForm
              ? "New here? Join DEVtinder"
              : "Already have an account? Sign In"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
