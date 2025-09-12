import { useState } from "react";
import { useSignup } from "../../hooks/useSignUp";
import { Eye, EyeOff } from "lucide-react";

const SignupForm = ({ onSwitchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skills, setSkills] = useState(''); 
  const [role, setRole] = useState("Engineer");
  const [duration, setDuration] = useState("full-time");
  const [seniority, setSeniority] = useState("Junior");
  const [validationErrors, setValidationErrors] = useState({});

  const { signup, isLoading, error: apiError } = useSignup();

  // Your validation logic is already perfect
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Full Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    signup(email, password, name, skills, duration, role, seniority);
  };

  // Your input change handler is also perfect. It correctly clears errors on type.
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

  const inputClasses = "mt-1 block w-full bg-transparent border-b-2 focus:outline-none p-2 pr-10 text-dark-text placeholder:text-[#edeef4]";
  const selectClasses = "mt-1 block w-full bg-transparent border-b-2 border-[#333544] focus:border-white focus:outline-none p-2 text-white rounded-md";
  const labelClasses = "text-xs font-medium text-[#84858c]";
  const errorTextClasses = "text-red-500 text-xs pt-1";

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold text-dark-text pb-8">Create your account</h1>
      {/* <p className="text-[#84858c] mb-4">Create your account</p> */}
      
      <form onSubmit={handleSignup} className="space-y-4" noValidate>
        <div className="flex space-x-3">
          <div className="w-1/2">
            <label className={labelClasses} htmlFor="name">Full Name</label>
            <input id="name" type="text" value={name} onChange={handleInputChange(setName, 'name')} required placeholder="John Doe" 
              className={`${inputClasses} ${validationErrors.name ? 'border-red-500' : 'border-[#1a1b26] focus:border-white'}`} />
            {validationErrors.name && <p className={errorTextClasses}>{validationErrors.name}</p>}
          </div>
          <div className="w-1/2">
            <label className={labelClasses} htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={handleInputChange(setEmail, 'email')} required placeholder="you@example.com" 
              className={`${inputClasses} ${validationErrors.email ? 'border-red-500' : 'border-[#1a1b26] focus:border-white'}`} />
            {validationErrors.email && <p className={errorTextClasses}>{validationErrors.email}</p>}
          </div>
        </div>

        <div>
          <label className={labelClasses} htmlFor="skills">Skills (comma-separated)</label>
          <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, Python" 
            className="mt-1 block w-full bg-transparent border-b-2 border-[#333544] focus:border-white focus:outline-none p-2 text-white placeholder:text-[#84858c] rounded-md" />
        </div>

        <div className="flex space-x-3 pb-9">
          <div className="w-1/3"><label className={labelClasses} htmlFor="role">Role</label><select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className={selectClasses}><option value="Engineer" className="bg-[#1a1b26]">Engineer</option><option value="Manager" className="bg-[#1a1b26]">Manager</option></select></div>
          <div className="w-1/3"><label className={labelClasses} htmlFor="seniority">Seniority</label><select id="seniority" value={seniority} onChange={(e) => setSeniority(e.target.value)} required className={selectClasses}><option value="Junior" className="bg-[#1a1b26]">Junior</option><option value="Mid" className="bg-[#1a1b26]">Mid-level</option><option value="Senior" className="bg-[#1a1b26]">Senior</option></select></div>
          <div className="w-1/3"><label className={labelClasses} htmlFor="duration">Availability</label><select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className={selectClasses}><option value="full-time" className="bg-[#1a1b26]">Full-time</option><option value="part-time" className="bg-[#1a1b26]">Part-time</option></select></div>
        </div>

        <div className="flex space-x-3">
          <div className="relative w-1/2">
            <label className={labelClasses} htmlFor="password">Password</label>
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={handleInputChange(setPassword, 'password')} required placeholder="6+ strong characters" 
              className={`${inputClasses} ${validationErrors.password ? 'border-red-500' : 'border-[#1a1b26] focus:border-white'}`} />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-2 top-10 text-[#84858c] hover:text-[#e4ddbc]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            {validationErrors.password && <p className={errorTextClasses}>{validationErrors.password}</p>}
          </div>
          <div className="relative w-1/2">
            <label className={labelClasses} htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleInputChange(setConfirmPassword, 'confirmPassword')} required placeholder="Re-enter password" 
              className={`${inputClasses} ${validationErrors.confirmPassword ? 'border-red-500' : 'border-[#1a1b26] focus:border-white'}`} />
            <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-2 top-10 text-[#84858c] hover:text-[#e4ddbc]">{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            {validationErrors.confirmPassword && <p className={errorTextClasses}>{validationErrors.confirmPassword}</p>}
          </div>
        </div>

        {apiError && <p className="text-red-500 text-xs text-center py-1">{apiError}</p>}
        
        <button type="submit" disabled={isLoading} className="w-full py-2.5 px-4 rounded-lg bg-[#1a1b26] hover:bg-black text-[#e4ddbc] font-bold transition-colors disabled:opacity-50 cursor-pointer">
          {isLoading ? "Creating Account..." : "Create an account"}
        </button>
        
        <p className="text-center text-xs text-dark-text-secondary pt-1">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchMode} className="font-semibold text-[#e4ddbc] hover:underline cursor-pointer">
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;

