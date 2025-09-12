import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Eye, EyeOff } from "lucide-react"; // 👈 import icons

const LoginForm = ({ onSwitchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const { login, isLoading, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
      <p className="text-[#84858c] mb-6">Please enter your details to sign in.</p>

      <form onSubmit={handleLogin} className="space-y-8">
        {/* Email Input */}
        <div>
          <label className="text-sm font-medium text-[#84858c]" htmlFor="email">
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

        {/* Password Input with Eye */}
        <div className="relative">
          <label
            className="text-sm font-medium text-[#84858c]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"} // 👈 toggle visibility
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
            className="absolute right-2 top-11 text-[#84858c] hover:text-[#e4ddbc]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-[#1a1b26] hover:bg-[--color-dark-button-hover] text-[#e4ddbc] font-bold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-dark-text-secondary">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="font-semibold text-[#e4ddbc] hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
