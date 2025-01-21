import React, { useState } from 'react';
import { X, Camera, Edit2 } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const [username, setUsername] = useState('Username');
  const [email, setEmail] = useState('user@example.com');
  const [about, setAbout] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {/* Banner */}
          <div className="h-32 bg-indigo-600 rounded-t-lg"></div>
          
          {/* Profile Picture */}
          <div className="absolute left-6 -bottom-12">
            <div className="relative group">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop"
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-800 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-16">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 uppercase mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 uppercase mb-2">
                  About Me
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">{username}</h2>
                  <p className="text-gray-400 text-sm">#{1234}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase mb-2">Email</h3>
                <p className="text-white">{email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase mb-2">About Me</h3>
                <p className="text-white">
                  {about || "This user hasn't written anything about themselves yet."}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase mb-2">Member Since</h3>
                <p className="text-white">Jan 1, 1970</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}