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
  const [localError, setLocalError] = useState(null);
  const [skills, setSkills] = useState(''); 
  const [role, setRole] = useState("Engineer");
  const [duration, setDuration] = useState("full-time");
  const [seniority, setSeniority] = useState("Junior"); // Default to Junior

  const { signup, isLoading, error } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    setLocalError(null);
  
    signup(email, password, name, skills, duration, role, seniority);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-dark-text">Welcome To Projex</h1>
      <p className="text-[#84858c] mb-6">Create your account</p>
      <form onSubmit={handleSignup} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-[#84858c]" htmlFor="name">Full Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none p-2 pr-10 text-dark-text placeholder:text-[#edeef4]" />
        </div>
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-[#84858c]" htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none p-2 pr-10 text-dark-text placeholder:text-[#edeef4]" />
        </div>
        {/* Skills */}
        <div>
          <label className="text-sm font-medium text-[#84858c]" htmlFor="skills">Skills (comma-separated)</label>
          <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, Python" className="mt-2 block w-full bg-transparent border-b-2 border-[#333544] focus:border-white focus:outline-none p-2 pr-10 text-white placeholder:text-[#84858c] rounded-md" />
        </div>
        {/* Role, Seniority, Duration */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-sm font-medium text-[#84858c]" htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className="mt-2 block w-full bg-transparent border-b-2 border-[#333544] focus:border-white focus:outline-none p-2 text-white rounded-md">
              <option value="Engineer" className="bg-[#1a1b26]">Engineer</option>
              <option value="Manager" className="bg-[#1a1b26]">Manager</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium text-[#84858c]" htmlFor="seniority">Seniority</label>
            <select id="seniority" value={seniority} onChange={(e) => setSeniority(e.target.value)} required className="mt-2 block w-full bg-transparent border-b-2 border-[#333544] focus:border-white focus:outline-none p-2 text-white rounded-md">
              <option value="Junior" className="bg-[#1a1b26]">Junior</option>
              <option value="Mid" className="bg-[#1a1b26]">Mid-level</option>
              <option value="Senior" className="bg-[#1a1b26]">Senior</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium text-[#84858c]" htmlFor="duration">Availability</label>
            <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="mt-2 block w-full bg-transparent border-b-2 border-[#333544] focus:border-white focus:outline-none p-2 text-white rounded-md">
              <option value="full-time" className="bg-[#1a1b26]">Full-time</option>
              <option value="part-time" className="bg-[#1a1b26]">Part-time</option>
            </select>
          </div>
        </div>
        {/* Password Fields... */}
        <div className="relative">
          <label className="text-sm font-medium text-[#84858c]" htmlFor="password">Password</label>
          <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="6+ strong characters" className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none p-2 pr-10 text-dark-text placeholder:text-[#edeef4]" />
          <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-2 top-9 text-[#84858c] hover:text-[#e4ddbc]"><Eye size={18} /></button>
        </div>
        <div className="relative">
          <label className="text-sm font-medium text-[#84858c]" htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter password" className="mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none p-2 pr-10 text-dark-text placeholder:text-[#edeef4]" />
          <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-2 top-9 text-[#84858c] hover:text-[#e4ddbc]"><Eye size={18} /></button>
        </div>

        {(localError || error) && <p className="text-red-500 text-xs text-center">{localError || error}</p>}
        
        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-lg bg-[#1a1b26] hover:bg-black text-[#e4ddbc] font-bold transition-colors disabled:opacity-50">
          {isLoading ? "Creating Account..." : "Create an account"}
        </button>
        <p className="text-center text-sm text-dark-text-secondary">Already have an account?{" "}<button type="button" onClick={onSwitchMode} className="font-semibold text-[#e4ddbc] hover:underline">Sign In</button></p>
      </form>
    </div>
  );
};

export default SignupForm;
