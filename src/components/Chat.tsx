import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Home, Settings, Plus, Search, Bell, HelpCircle, AtSign } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import CreateServerModal from './CreateServerModal';
import ServerSettingsModal from './ServerSettingsModal';
import ProfileModal from './ProfileModal';
import CreateChannelModal from './CreateChannelModal';
import { useAtom } from "jotai";
import { userInfoAtom } from '../store';

interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}

interface Channel {
  id: string;
  name: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    name: string;
    avatar: string;
  };
}

interface DMUser {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastMessage: string;
  time: string;
  avatar: string;
  messages: Message[];
}

const mockUsers: DMUser[] = [
  {
    id: '1',
    name: "Sarah Wilson",
    status: "online",
    lastMessage: "Thanks for the help!",
    time: "2h",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    messages: []
  },
  {
    id: '2',
    name: "Alex Thompson",
    status: "online",
    lastMessage: "When are you free to chat?",
    time: "4h",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    messages: []
  }
];

const defaultServers: Server[] = [
  {
    id: '1',
    name: 'Development Team',
    icon: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=120&fit=crop',
    channels: [
      {
        id: '1',
        name: 'general',
        messages: []
      },
      {
        id: '2',
        name: 'announcements',
        messages: []
      }
    ]
  }
];

function ServerIcon({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`w-12 h-12 ${active ? 'bg-indigo-500' : 'bg-gray-700'} rounded-full flex items-center justify-center text-white hover:bg-indigo-500 cursor-pointer transition-colors mb-2`}
    >
      {children}
    </div>
  );
}

function Message({ message }: { message: Message }) {
  return (
    <div className="flex p-4 hover:bg-gray-700/30">
      <img src={message.sender.avatar}
           className="w-10 h-10 rounded-full mr-4" 
           alt={message.sender.name} />
      <div>
        <div className="flex items-center">
          <span className="font-medium text-white mr-2">{message.sender.name}</span>
          <span className="text-gray-400 text-sm">{message.timestamp}</span>
        </div>
        <p className="text-gray-300">{message.content}</p>
      </div>
    </div>
  );
}

function DMUser({ user, isActive, onClick }: { user: DMUser; isActive: boolean; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer ${isActive ? 'bg-gray-700' : ''}`}
    >
      <div className="relative">
        <img src={user.avatar} className="w-10 h-10 rounded-full mr-3" alt={user.name} />
        <div className={`absolute bottom-0 right-2 w-3 h-3 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-gray-800`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-gray-100 truncate">{user.name}</h3>
          <span className="text-xs text-gray-400 ml-2">{user.time}</span>
        </div>
        <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
      </div>
    </div>
  );
}

function Channel({ name, active, onClick }: { name: string; active?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded cursor-pointer ${active ? 'bg-gray-700 text-white' : ''}`}
    >
      <Hash className="w-5 h-5 mr-2" />
      <span>{name}</span>
    </div>
  );
}

export default function Chat() {
  const [userInfo, ] = useAtom(userInfoAtom);

  const [activeView, setActiveView] = useState<'dm' | 'server'>('dm');
  const [showProfile, setShowProfile] = useState(false);
  const [activeDM, setActiveDM] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any | null>();
  const [activeServer, setActiveServer] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [servers, setServers] = useState<Server[]>(defaultServers);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState<DMUser[]>(mockUsers);
  const navigate = useNavigate();


  
  const { socket, isConnected } = useSocket();
  // const [username] = useState('User_' + Math.floor(Math.random() * 1000));
  
  // const activeUser = users.find(user => user.id === activeDM);
  const currentServer = servers.find(server => server.id === activeServer);
  const currentChannel = currentServer?.channels.find(channel => channel.id === activeChannel);
  
  console.log("hello", activeDM, activeUser, users);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join with user info
    socket.emit('join', { userId: userInfo.userId, username: userInfo.userName });
    // socket.emit('authenticate', { userId: socket.id, token });

    // Listen for new messages
    socket.on('newMessage', ({ message, channelId, serverId }) => {
      if (serverId) {
        setServers(prevServers => prevServers.map(server => 
          server.id === serverId
            ? {
                ...server,
                channels: server.channels.map(channel =>
                  channel.id === channelId
                    ? { ...channel, messages: [...channel.messages, message] }
                    : channel
                )
              }
            : server
        ));
      } else {
        console.log("newMessage", channelId, message, users[0].id);
        setUsers(prevUsers => prevUsers.map(user => 
          user.id == channelId
            ? { 
                ...user, 
                messages: [...user.messages, message],
                lastMessage: message.content,
                time: 'now'
              }
            : user
        ));
      }
    });

    // Listen for channel history
    socket.on('channelHistory', ({ messages, channelId, serverId }) => {
      console.log("channelHistory", messages, channelId, serverId);
      if (serverId) {
        setServers(prevServers => prevServers.map(server => 
          server.id === serverId
            ? {
                ...server,
                channels: server.channels.map(channel =>
                  channel.id === channelId
                    ? { ...channel, messages }
                    : channel
                )
              }
            : server
        ));
      } else {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === channelId
            ? { ...user, messages }
            : user
        ));
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('channelHistory');
    };
  }, [socket, isConnected, userInfo]);

  // Join channel when active channel changes
  useEffect(() => {
    if (!socket || !isConnected) return;
    console.log("activeDM", activeDM);
    
    if (activeView === 'dm' && activeDM) {
      socket.emit('joinChannel', { channelId: activeDM });
    } else if (activeView === 'server' && activeServer && activeChannel) {
      socket.emit('joinChannel', { channelId: activeChannel, serverId: activeServer });
    }
  }, [socket, isConnected, activeView, activeDM, activeServer, activeChannel]);

  // Listen for user list updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("userList", (userList) => {
      const tempUser = (userList as DMUser[]).find(user => user.id == activeDM); // Filter Active User
      console.log('userlist--------------->', activeDM, userList, tempUser);
      setActiveUser(tempUser);
      const onlineUsers = (userList as DMUser[]).filter(user => user.id != userInfo.userId);
      setUsers(onlineUsers);
    });

    return () => {
      socket.off("userList");
    };
  }, [socket]);

  useEffect(() => {
    const tempUser = users.find(user => user.id === activeDM);
    setActiveUser(tempUser);
  }, [socket, users, activeDM])

  const handleCreateServer = (name: string, icon: string) => {
    const newServer: Server = {
      id: String(servers.length + 1),
      name,
      icon,
      channels: [
        {
          id: '1',
          name: 'general',
          messages: []
        }
      ]
    };
    setServers([...servers, newServer]);
    setActiveServer(newServer.id);
    setActiveView('server');
    setShowCreateServer(false);
  };

  const handleCreateChannel = (name: string) => {
    if (!currentServer) return;

    const newChannel: Channel = {
      id: String(currentServer.channels.length + 1),
      name,
      messages: []
    };

    setServers(prevServers => prevServers.map(server => 
      server.id === currentServer.id
        ? { ...server, channels: [...server.channels, newChannel] }
        : server
    ));

    setActiveChannel(newChannel.id);
    setShowCreateChannel(false);
  };

  const handleUpdateServer = (name: string, icon: string) => {
    setServers(servers.map(server => 
      server.id === activeServer 
        ? { ...server, name, icon }
        : server
    ));
    setShowServerSettings(false);
  };

  const handleDeleteServer = () => {
    setServers(servers.filter(server => server.id !== activeServer));
    setActiveServer(null);
    setActiveView('dm');
    setShowServerSettings(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !isConnected) return;

    if (activeView === 'dm' && activeDM) {
      socket.emit('sendMessage', {
        content: messageInput,
        channelId: activeDM
      });
    } else if (currentServer && activeChannel) {
      socket.emit('sendMessage', {
        content: messageInput,
        channelId: activeChannel,
        serverId: currentServer.id
      });
    }

    setMessageInput('');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Servers sidebar */}
      <div className="w-[72px] bg-gray-900 p-3 flex flex-col items-center border-r border-gray-800">
        <ServerIcon active={activeView === 'dm'} onClick={() => setActiveView('dm')}>
          <Home className="w-6 h-6" />
        </ServerIcon>
        <div className="w-8 h-[2px] bg-gray-800 rounded-full my-2"></div>
        {servers.map(server => (
          <ServerIcon 
            key={server.id}
            active={server.id === activeServer}
            onClick={() => {
              setActiveServer(server.id);
              setActiveView('server');
              setActiveChannel(server.channels[0].id);
            }}
          >
            <img 
              src={server.icon} 
              alt={server.name}
              className="w-6 h-6 rounded-full"
            />
          </ServerIcon>
        ))}
        <ServerIcon onClick={() => setShowCreateServer(true)}>
          <Plus className="w-6 h-6" />
        </ServerIcon>
      </div>

      {/* Channels/DM sidebar */}
      <div className="w-60 bg-gray-800 flex flex-col">
        {activeView === 'dm' ? (
          <>
            <div className="h-14 flex items-center px-4 shadow-md bg-gray-800">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Find or start a conversation"
                  className="w-full bg-gray-900 text-gray-200 placeholder-gray-400 px-4 py-2 rounded h-9"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-2 mb-2">
                <h2 className="text-gray-400 text-xs font-semibold px-2 mb-2">DIRECT MESSAGES</h2>
                {users.map(user => (
                  <DMUser
                    key={user.id}
                    user={user}
                    isActive={user.id === activeDM}
                    onClick={() => setActiveDM(user.id)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : currentServer && (
          <>
            <div className="p-4 shadow-md flex justify-between items-center">
              <h2 className="font-bold">{currentServer.name}</h2>
              <button
                onClick={() => setShowServerSettings(true)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="flex justify-between items-center px-2 mb-2">
                <h3 className="text-gray-400 text-xs font-semibold uppercase">Channels</h3>
                <button
                  onClick={() => setShowCreateChannel(true)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {currentServer.channels.map(channel => (
                <Channel
                  key={channel.id}
                  name={channel.name}
                  active={channel.id === activeChannel}
                  onClick={() => setActiveChannel(channel.id)}
                />
              ))}
            </div>
          </>
        )}
        <div className="p-4 bg-gray-800/90 border-t border-gray-700">
          <div className="flex items-center">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop" 
                 className="w-8 h-8 rounded-full mr-2" 
                 alt="Profile" />
            <div 
              className="flex-1 cursor-pointer hover:underline"
              onClick={() => setShowProfile(true)}
            >
              <div className="font-medium">{userInfo.userName}</div>
              <div className="text-xs text-gray-400">#1234</div>
            </div>
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/signin')} />
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="h-14 flex items-center px-4 shadow-md bg-gray-800">
          {activeView === 'dm' ? (
            activeUser && (
              <>
                <AtSign className="w-6 h-6 text-gray-400 mr-2" />
                <span className="font-bold">{activeUser.name}</span>
              </>
            )
          ) : currentChannel && (
            <>
              <Hash className="w-6 h-6 text-gray-400 mr-2" />
              <span className="font-bold">{currentChannel.name}</span>
            </>
          )}
          <div className="ml-auto flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <Search className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <HelpCircle className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {activeView === 'dm' ? (
            activeUser ? (
              activeUser.messages.map((message: Message) => (
                <Message key={message.id} message={message} />
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a conversation to start messaging
              </div>
            )
          ) : currentChannel ? (
            currentChannel.messages.map(message => (
              <Message key={message.id} message={message} />
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a channel to start messaging
            </div>
          )}
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={
                activeView === 'dm'
                  ? `Message ${activeUser ? `@${activeUser.name}` : ''}`
                  : `Message #${currentChannel?.name || ''}`
              }
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400"
            />
          </div>
        </form>
      </div>

      {/* Modals */}
      {showCreateServer && (
        <CreateServerModal
          onClose={() => setShowCreateServer(false)}
          onSubmit={handleCreateServer}
        />
      )}

      {showCreateChannel && (
        <CreateChannelModal
          onClose={() => setShowCreateChannel(false)}
          onSubmit={handleCreateChannel}
        />
      )}

      {showServerSettings && currentServer && (
        <ServerSettingsModal
          onClose={() => setShowServerSettings(false)}
          serverName={currentServer.name}
          serverIcon={currentServer.icon}
          onUpdateServer={handleUpdateServer}
          onDeleteServer={handleDeleteServer}
        />
      )}

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}