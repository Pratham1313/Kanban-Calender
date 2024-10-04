import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  function handle_login(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        toast.success("Login successful!");
        const token = response.data.tokenn;
        localStorage.setItem("jwt", token);
        setAuthUser(token);
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            error.response.data.error || "Login failed. Please try again."
          );
        } else {
          toast.error("An unexpected error occurred.");
        }
      });
  }

  return (
    <div className="w-full h-[100vh] bg-neutral-900 text-neutral-50 mob:h-[90vh] flex items-center xs:px-0 xs:items-end xs:pb-[180px] relative">
      <div className="load-animate  w-[380px] z-10 bg-black/70 mx-auto lg:w-[430px] rounded-md px-8 pt-16 pb-20 xs:pt-9 shadow-[B6C4B6] shadow-sm border-stone-900 text-white">
        <h1 className="text-white font-semibold text-3xl select-none">
          Sign In
        </h1>
        <form className="mt-[40px]" onSubmit={handle_login} action="POST">
          <input
            className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm bg-[#333333] border-b-[3px] border-gray-300 focus:border-blue-400 focus:outline-none p-2"
            placeholder="Registered Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <div className="relative mt-[25px]">
            <input
              type={show ? "text" : "password"}
              className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm bg-[#333333] border-b-[3px] border-t-0 border-l-0 border-r-0 outline-none focus:ring-0 border-gray-300 focus:border-blue-400 p-2 pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              style={{ width: "24px", height: "24px" }}
            >
              {show ? <VscEyeClosed size={24} /> : <VscEye size={24} />}
            </button>
          </div>
          <button
            className="w-full h-[7vh] bg-gradient-to-tr from-blue-800 to-blue-400 rounded-sm mb-4 text-xl font-medium mt-[25px] select-none"
            type="submit"
          >
            Login
          </button>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2 mt-2">
              <Link to="/Signup" className="flex gap-2 items-center">
                <p className="font-light select-none">
                  {"Don't Have an Account?"}
                </p>
                <p className="font-medium text-gray-300 cursor-pointer duration-150  hover:text-white select-none">
                  Register
                </p>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
