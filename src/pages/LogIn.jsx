import React from "react";
import SignIn from "../components/signIn/SignIn";
import SignUp from '../components/signUp/SignUp';
import { useState } from 'react';

function LogIn() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <>
      {showSignIn ? (
        <SignIn
          onSwitchToSignUp={() => setShowSignIn(false)}
          onSignInSuccess={() => {/* Xử lý sau đăng nhập nếu cần */}}
        />
      ) : (
        <SignUp
          onSwitchToSignIn={() => setShowSignIn(true)}
        />
      )}
    </>
  );
}
export default LogIn;