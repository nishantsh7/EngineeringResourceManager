import { useState } from "react";
import { useSignup } from "../../hooks/useSignUp";
import { Eye, EyeOff } from "lucide-react"; // lightweight icons

const SignupForm = ({ onSwitchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { signup, isLoading, error } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(null);
    signup(email, password, name);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-dark-text">Welcome To Projex</h1>
      <p className="text-[#84858c] mb-6">Create your account</p>

      <form onSubmit={handleSignup} className="space-y-8">
        {/* Full Name */}
        <div>
          <label
            className="text-sm font-medium text-[#84858c]"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] 
             focus:border-white focus:outline-none 
             p-2 pr-10 text-dark-text placeholder:text-[#edeef4]"
          />
        </div>

        {/* Email */}
        <div>
          <label
            className="text-sm font-medium text-[#84858c]"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] 
             focus:border-white focus:outline-none 
             p-2 pr-10 text-dark-text placeholder:text-[#edeef4]"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label
            className="text-sm font-medium text-[#84858c]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="6+ strong characters"
            className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] 
             focus:border-white focus:outline-none 
             p-2 pr-10 text-dark-text placeholder:text-[#edeef4]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-11 text-[#84858c] hover:text-[#e4ddbc] cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label
            className="text-sm font-medium text-[#84858c]"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter password"
            className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] 
             focus:border-white focus:outline-none 
             p-2 pr-10 text-dark-text placeholder:text-[#edeef4]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-11 text-[#84858c] hover:text-[#e4ddbc] cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Errors */}
        {(localError || error) && (
          <p className="text-red-500 text-xs text-center">
            {localError || error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-[#1a1b26] hover:bg-[--color-dark-button-hover] text-[#e4ddbc] font-bold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Creating Account..." : "Create an account"}
        </button>

        <p className="text-center text-sm text-dark-text-secondary">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="font-semibold text-[#e4ddbc] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
