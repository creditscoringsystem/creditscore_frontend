// src/components/ForgotPasswordModal.tsx
import { useState } from "react";

interface Props {
  onClose: () => void;
  onBackToLogin: () => void;
}

const sendResetCode = async (_email: string) => { void _email; return Promise.resolve(); };
const verifyResetCode = async (_email: string, _code: string) => { void _email; void _code; return Promise.resolve(); };
const resetPassword = async (_email: string, _code: string, _newPwd: string) => { void _email; void _code; void _newPwd; return Promise.resolve(); };

const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Password must contain at least one special character.";
  return null;
};

export default function ForgotPasswordModal({ onClose, onBackToLogin }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Đóng modal với hiệu ứng
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 360);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await sendResetCode(email);
    setStep(2);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await verifyResetCode(email, code);
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const pwdError = validatePasswordStrength(newPwd);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Passwords do not match.");
      return;
    }
    await resetPassword(email, code, newPwd);
    setStep(4);
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm transition-opacity duration-300" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`relative bg-white/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl
          ${isClosing ? "animate-scale-out" : "animate-scale-in"}`}>
          <button onClick={handleClose} className="absolute top-4 right-4 text-[#0AC909] hover:opacity-80">✕</button>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0AC909] text-center mb-6 drop-shadow-md">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter Verification Code"}
            {step === 3 && "Set New Password"}
            {step === 4 && "Success!"}
          </h2>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 text-[#0A6500] focus:outline-none transition" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-center"><button type="submit" className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:opacity-90 transition">Send Code</button></div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="Enter code" className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 text-[#0A6500] focus:outline-none transition" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-center"><button type="submit" className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:opacity-90 transition">Verify Code</button></div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <input type="password" required value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New password" className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 text-[#0A6500] focus:outline-none transition" />
              <input type="password" required value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-2 rounded-full bg-white bg-opacity-30 text-[#0A6500] focus:outline-none transition" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-center"><button type="submit" className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:opacity-90 transition">Reset Password</button></div>
            </form>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center">
              <p className="text-[#0AC909] font-semibold">Your password has been reset successfully!</p>
              <button onClick={onBackToLogin} className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:opacity-90 transition">Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
