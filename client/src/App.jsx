import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import Navbar from './Component/Navbar/Navbar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { verify } from './features/userSlice';
import Profile from './pages/Profile/Profile'
import './App.css';
import ManageAdmins from './pages/ManageAdmins/ManageAdmins';
import ManageUsers from './pages/ManageUsers/ManageUsers';
import Event from './pages/Events/Event';
import Toast from './Component/Toast/Toast';
import ConvoSpace from './pages/ConvoSpace/ConvoSpace';
import UserEvents from './pages/UserEvents/UserEvents';
import VoiceConversation from "./pages/VoiceConversation/VoiceConversation";
import Analytics from './pages/Analytics/Analytis';


function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      setIsVerifying(true);
      const result = await dispatch(verify());

      if (verify.fulfilled.match(result)) {
        if (location.pathname === "/") {
          navigate("/dashboard");
        }
      } else {
        if (location.pathname !== "/") {
          navigate("/");
        }
      }

      setIsVerifying(false);
    };

    verifyUser();
  }, []);


  if (isVerifying) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const showNavbar = location.pathname !== '/';

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/manage-profile' element={<Profile />} />
        <Route path='/manage-admins' element={<ManageAdmins />} />
        <Route path='/manage-users' element={<ManageUsers />} />
        <Route path='/manage-event' element={<Event />} />
        <Route path='/convo-space' element={<ConvoSpace />} />
        <Route path='/events' element={<UserEvents />} />
        <Route path='/voice-conversation' element={<VoiceConversation />} />
        <Route path='/analytics' element={<Analytics />} />
      </Routes>
    </div >
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toast />
    </Router>
  );
}

export default App;