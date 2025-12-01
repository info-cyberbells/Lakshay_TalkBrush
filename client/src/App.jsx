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
import AdminDashboard from './pages/Dashboard/Admin-dashboard';
import UseDashboard from './pages/Dashboard/UserDashboard';
import TermsConditions from "./pages/SettingPages/TermsConditions";
import PrivacyPolicy from "./pages/SettingPages/PrivacyPolicy";
import Contactus from "./pages/SettingPages/Contactus";
import HowTalkBrushWorks from './pages/HowTalkBrushWorks/HowTalkBrushWorks';


function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkInitialAuth = () => {
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      if (authToken) {
        if (location.pathname === "/") {
          const userType = localStorage.getItem('userType');
          if (userType === "1") {
            navigate("/dashboard", { replace: true });
          } else if (userType === "2") {
            navigate("/admin-dashboard", { replace: true });
          } else if (userType === "3") {
            navigate("/user-dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      } else {
        if (location.pathname.startsWith('/accent/room/')) {
          const roomCode = location.pathname.split('/accent/room/')[1];
          navigate(`/?room=${roomCode}`, { replace: true });
          return;
        }
      }

      setIsVerifying(false);
    };

    checkInitialAuth();
  }, [location.pathname, navigate]);


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
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UseDashboard />} />
        <Route path='/manage-profile' element={<Profile />} />
        <Route path='/manage-admins' element={<ManageAdmins />} />
        <Route path='/manage-users' element={<ManageUsers />} />
        <Route path='/manage-event' element={<Event />} />
        <Route path='/convo-space' element={<ConvoSpace />} />
        <Route path='/events' element={<UserEvents />} />
        <Route path='/voice-conversation' element={<VoiceConversation />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path="/accent/room/:roomCode" element={<VoiceConversation />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<Contactus />} />
        <Route path="/how-talkbrush-works" element={<HowTalkBrushWorks />} />

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