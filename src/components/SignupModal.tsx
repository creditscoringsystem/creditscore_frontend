import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface Props {
  onClose: () => void;
  onBackToLogin: () => void;
}

const validatePasswordStrength = (pwd: string): string | null => {
  if (pwd.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pwd)) return "Password must include an uppercase letter.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) return "Password must include a special symbol.";
  return null;
};

export default function SignupModal({ onClose, onBackToLogin }: Props) {
  const [form, setForm] = useState({ first: "", last: "", email: "", pwd: "", confirm: "" });
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const passwordsMatch = form.pwd !== "" && form.pwd === form.confirm;

  const handleChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pwdErr = validatePasswordStrength(form.pwd);
    if (pwdErr) return setError(pwdErr);
    if (!passwordsMatch) return setError("Passwords do not match.");
    setError(null);
    setSuccess(true);
  };

  // Xử lý đóng popup có hiệu ứng out
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500); // 0.5s khớp với thời gian animation
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`relative flex w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden
          ${isClosing ? "animate-slide-out" : "animate-slide-in"}`}>
          {/* Close */}
          <button className="absolute top-4 right-4 text-[#0AC909] hover:opacity-80" onClick={handleClose}>✕</button>

          {/* Form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 space-y-6 text-[#0A6500]">
            <h2 className="text-3xl font-bold text-[#0AC909]">Create an account</h2>
            <p className="text-sm">Already have an account?{' '}
              <button
                type="button"
                className="underline text-[#0AC909] hover:opacity-80"
                onClick={() => { handleClose(); onBackToLogin(); }}>
                Log in
              </button>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  value={form.first}
                  onChange={handleChange('first')}
                  className="px-4 py-2 rounded-full bg-white bg-opacity-30 placeholder-[#0A6500] focus:outline-none text-base"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.last}
                  onChange={handleChange('last')}
                  className="px-4 py-2 rounded-full bg-white bg-opacity-30 placeholder-[#0A6500] focus:outline-none text-base"
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange('email')}
                className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 placeholder-[#0A6500] focus:outline-none text-base"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type={showPwd1 ? 'text' : 'password'}
                    placeholder="Password"
                    value={form.pwd}
                    onChange={handleChange('pwd')}
                    className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 placeholder-[#0A6500] focus:outline-none text-base"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowPwd1(true)}
                    onMouseUp={() => setShowPwd1(false)}
                    onMouseLeave={() => setShowPwd1(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0AC909] cursor-pointer hover:opacity-80"
                  >
                    {showPwd1 ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPwd2 ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={form.confirm}
                    onChange={handleChange('confirm')}
                    className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 placeholder-[#0A6500] focus:outline-none text-base"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowPwd2(true)}
                    onMouseUp={() => setShowPwd2(false)}
                    onMouseLeave={() => setShowPwd2(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0AC909] cursor-pointer hover:opacity-80"
                  >
                    {showPwd2 ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs">Use 8 or more characters with a mix of letters, numbers &amp; symbols</p>
              {passwordsMatch && <p className="text-green-500 text-sm">Passwords match ✓</p>}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="btn-primary-green"
                  style={{ height: 44 }}
                >
                  Create an account
                </button>
              </div>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block w-1/2 h-full overflow-hidden">
            <img
              src="/signup-illustration.jpeg"
              alt="signup illustration"
              className="w-full h-full object-cover"
              style={{
                borderTopLeftRadius: "225.5px",
                borderBottomLeftRadius: "225.5px",
                borderTopRightRadius: "1rem",
                borderBottomRightRadius: "1rem"
              }}
            />
          </div>
        </div>
      </div>

      {/* Success popup */}
      {success && (
        <>
          <div className="fixed inset-0 bg-black/40 z-60" onClick={() => { setSuccess(false); handleClose(); }} />
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg text-center space-y-6">
              <h3 className="text-2xl font-bold text-[#0AC909]">Almost there!</h3>
              <p className="text-[#0A6500]">Please check your email and click the confirmation link to activate your account.</p>
              <button
                onClick={() => { setSuccess(false); handleClose(); }}
                className="px-8 py-3 bg-white bg-opacity-40 rounded-full font-semibold text-[#0A6500] hover:bg-opacity-60 transition"
              >
                OK – back to homepage
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
