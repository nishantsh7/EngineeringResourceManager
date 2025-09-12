import { useState } from 'react';
import Login from '../components/authform/Login'
import Signup from '../components/authform/Signup'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-dark-bg] p-4">
      {/* This is the main card, styled to match the image */}
      <div className="w-full max-w-md rounded-2xl shadow-lg bg-[--color-dark-card] p-8">
        {isLogin ? (
          <Login onSwitchMode={switchModeHandler} />
        ) : (
          <Signup onSwitchMode={switchModeHandler} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;

