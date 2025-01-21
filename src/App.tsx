import { Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export default App;