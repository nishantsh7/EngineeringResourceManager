import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Eye, EyeOff } from "lucide-react"; 

const LoginForm = ({ onSwitchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors
  const { login, isLoading, error: apiError } = useLogin();

  // 1. Validation logic for the form
  const validateForm = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    return errors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Stop submission if there are errors
    }
    setValidationErrors({}); // Clear errors and proceed
    login(email, password);
  };

  // 2. Handler to clear errors as the user types
  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Shared class strings for consistency
  const inputClasses = "mt-1 block w-full bg-transparent border-b-2 focus:outline-none p-2 pr-10 text-dark-text placeholder:text-[#edeef4]";
  const labelClasses = "text-xs font-medium text-[#84858c]";
  const errorTextClasses = "text-red-500 text-xs pt-1";

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold text-white py-2">Welcome Back</h1>
      <p className="text-[#84858c] mb-4">Please enter your details to sign in.</p>

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        {/* Email Input */}
        <div>
          <label className={labelClasses} htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleInputChange(setEmail, 'email')} // 3. Use the new handler
            required
            placeholder="you@example.com"
            // 4. Conditionally apply red border
            className={`${inputClasses} ${validationErrors.email ? 'border-red-500' : 'border-[#1a1b26] focus:border-white'}`}
          />
          {/* 5. Show the specific error message */}
          {validationErrors.email && <p className={errorTextClasses}>{validationErrors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="relative">
          <label className={labelClasses} htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleInputChange(setPassword, 'password')} // 3. Use the new handler
            required
            placeholder="6+ strong characters"
            // 4. Conditionally apply red border
            className={`${inputClasses} ${validationErrors.password ? 'border-red-500' : 'border-[#1a1b26] focus:border-white'}`}
          />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-11 text-[#84858c] hover:text-[#e4ddbc] cursor-pointer">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {/* 5. Show the specific error message */}
          {validationErrors.password && <p className={errorTextClasses}>{validationErrors.password}</p>}
        </div>

        {/* API Error from the hook */}
        {apiError && <p className="text-red-500 text-xs text-center">{apiError}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-[#1a1b26] hover:bg-black text-[#e4ddbc] font-bold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center text-xs text-dark-text-secondary pt-1">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onSwitchMode} className="font-semibold text-[#e4ddbc] hover:underline cursor-pointer">
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
