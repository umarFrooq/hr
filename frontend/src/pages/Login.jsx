import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/assets/CodeTricksLogo.svg";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { Shield } from "lucide-react";

const Login = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Redirect to dashboard if already logged in
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-25 w-25" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Code Tricks</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div> */}

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Please login in to your account</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Code Trick Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
