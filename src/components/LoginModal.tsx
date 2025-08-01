import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface Props {
  onClose: () => void;
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess, onForgotPassword }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo@example.com" && password === "demo123") {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  // Hiệu ứng tắt popup
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 360);
  };

  return (
    <>
      {/* Overlay trắng đục + blur nền */}
      <div
        className="fixed inset-0 bg-white/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`relative bg-white/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl
          ${isClosing ? "animate-scale-out" : "animate-scale-in"}`}>
          {/* nút đóng */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#0AC909] hover:opacity-80"
          >
            ✕
          </button>

          {/* Tiêu đề */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0AC909] text-center mb-6 drop-shadow-md">
            Login
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[#0AC909] mb-1">
                Email
                <span className={`${error ? "text-red-500 ml-1" : "invisible"}`}>
                  *
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@gmail.com"
                className={
                  `w-full px-4 py-2 rounded-full
                  bg-white bg-opacity-30 placeholder-[#0A6500] text-[#0A6500]
                  focus:outline-none transition
                  ${error ? "border border-red-500" : "border border-transparent"}`
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#0AC909] mb-1">
                Password
                <span className={`${error ? "text-red-500 ml-1" : "invisible"}`}>
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={
                    `w-full px-4 py-2 rounded-full
                    bg-white bg-opacity-30 placeholder-[#0A6500] text-[#0A6500]
                    focus:outline-none transition
                    ${error ? "border border-red-500" : "border border-transparent"}`
                  }
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPwd(true)}
                  onMouseUp={() => setShowPwd(false)}
                  onMouseLeave={() => setShowPwd(false)}
                  className="
                    absolute right-3
                    top-1/2 transform -translate-y-1/2
                    h-5 w-5 flex items-center justify-center
                    text-[#0AC909] cursor-pointer
                    transition-colors duration-200 hover:text-green-800
                  "
                >
                  {showPwd ? (
                    <EyeIcon className="h-full w-full" />
                  ) : (
                    <EyeSlashIcon className="h-full w-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onForgotPassword();
                }}
                className="text-sm text-[#0AC909] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Thông báo lỗi */}
            {error && (
              <p className="text-red-200 text-sm">
                Sorry, you entered the wrong email or password.
              </p>
            )}

            {/* Nút Sign in */}
            <div className="text-center">
              <button
                type="submit"
                className="
                  px-12 py-3 bg-white text-green-600 font-bold
                  rounded-full transform transition
                  duration-200 ease-in-out hover:shadow-xl
                  hover:ring-2 hover:ring-green-200
                "
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Link Register */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account yet?{' '}
            <a
              href="/signup"
              onClick={handleClose}
              className="underline hover:text-[#0AC909] text-[#0AC909]"
            >
              Register for free
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
