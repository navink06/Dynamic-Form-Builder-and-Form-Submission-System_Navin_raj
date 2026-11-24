import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../store/slices/authSlice";
import {
  FormInput,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const action = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(action)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-200">
            <FormInput className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Role-Based Sign In
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authenticate with your Admin role credentials
          </p>
        </div>

        {/* Informative message from registration */}
        {redirectMessage && (
          <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{redirectMessage}</span>
          </div>
        )}

        {/* Security / Role requirement alert */}
        <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Role-Based Access Control</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Only users assigned the{" "}
            <span className="font-bold text-brand-700">Admin</span> role are
            permitted to log in. Accounts with User, Staff, or Manager roles are
            restricted from dashboard access.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Field */}
          {/* <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Role <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none bg-white text-slate-800"
              >
                <option value="admin">Admin (Authorized for Dashboard)</option>
                <option value="user">User (Unauthorized - Access Blocked)</option>
                <option value="staff">Staff (Unauthorized - Access Blocked)</option>
                <option value="manager">Manager (Unauthorized - Access Blocked)</option>
              </select>
            </div>
            {role !== 'admin' && (
              <p className="mt-1.5 text-xs text-amber-600 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Only the Admin role is permitted to log in.
              </p>
            )}
          </div> */}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || role !== "admin"}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {role.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Need an account?{" "}
          <Link
            to="/register"
            className="font-bold text-brand-600 hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
