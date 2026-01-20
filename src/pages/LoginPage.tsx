import { Link, useNavigate } from "react-router";
import Header from "../components/layout/Header";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { loginApi } from "../api/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await loginApi(email, password);
      login({ email, authToken: data.token, refreshToken: data.refreshToken });
      navigate('/');
    } catch (error: any) {
      toast.error(error.response.data.errors[0].error);  
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-teal-900">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm/6 font-medium text-teal-700">
                  Email address
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-teal-900 outline-1 -outline-offset-1 outline-emerald-200 placeholder:text-teal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-teal-700">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-teal-900 outline-1 -outline-offset-1 outline-emerald-200 placeholder:text-teal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-teal-700">
            Not a member?{' '}
            <Link to="/register" className="font-semibold text-rose-500 hover:text-rose-400 hover:cursor-pointer">             
                Register            
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}