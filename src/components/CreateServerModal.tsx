import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface CreateServerModalProps {
  onClose: () => void;
  onSubmit: (serverName: string, serverIcon: string) => void;
}

export default function CreateServerModal({ onClose, onSubmit }: CreateServerModalProps) {
  const [serverName, setServerName] = useState('');
  const [serverIcon, setServerIcon] = useState('https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=120&fit=crop');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(serverName, serverIcon);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Create a Server</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img 
                  src={serverIcon}
                  alt="Server icon"
                  className="w-24 h-24 rounded-full object-cover group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-400">Recommended size: 120x120</p>
            </div>

            <div>
              <label htmlFor="server-name" className="block text-sm font-medium text-gray-400 uppercase mb-2">
                Server Name
              </label>
              <input
                id="server-name"
                type="text"
                required
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter server name"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Server
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}