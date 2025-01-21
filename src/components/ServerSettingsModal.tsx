import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

interface ServerSettingsModalProps {
  onClose: () => void;
  serverName: string;
  serverIcon: string;
  onUpdateServer: (name: string, icon: string) => void;
  onDeleteServer: () => void;
}

export default function ServerSettingsModal({ 
  onClose, 
  serverName: initialServerName, 
  serverIcon: initialServerIcon,
  onUpdateServer,
  onDeleteServer
}: ServerSettingsModalProps) {
  const [serverName, setServerName] = useState(initialServerName);
  const [serverIcon, setServerIcon] = useState(initialServerIcon);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateServer(serverName, serverIcon);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Server Settings</h2>
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

            <div className="pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Server
              </button>
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-full max-w-sm rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Delete Server</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this server? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteServer();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete Server
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}