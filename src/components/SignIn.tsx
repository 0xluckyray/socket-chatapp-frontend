import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useAtom } from "jotai";
import { userInfoAtom } from '../store';

export default function SignIn() {
  const [, setUserInfo] = useAtom(userInfoAtom);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password
    }
    const response = await axios.post('http://localhost:3000/api/users/sign-in', payload);
    console.log(response.data);
    if(response.status == 200){
      localStorage.setItem('token', response.data.token);
      setUserInfo({
        userId: response.data.userid,
        userName: response.data.username,
        name: response.data.name
      });
      navigate('/chat');
    }
    else{
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MessageSquare className="h-12 w-12 text-indigo-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome back!</h2>
          <p className="mt-2 text-gray-400">We're so excited to see you again!</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 uppercase mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 uppercase mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-sm text-gray-400 text-center">
            Need an account?{' '}
            <Link to="/signup" className="font-medium text-indigo-500 hover:text-indigo-400">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}