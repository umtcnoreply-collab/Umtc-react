import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import type { RootState } from "./store/store";
import { apiConfig } from "./config/apiConfig";
import RegistrationPage from "./pages/RegistrationPage";
import BasicDetailsPage from "./pages/BasicDetailsPage";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DocumentsPage from "./pages/DocumentsPage";
import PreviewPage from "./pages/PreviewPage";
import ThankYouPage from "./pages/ThankYouPage";
import ProfilePage from "./pages/ProfilePage";
import MobileHeader from "./components/MobileHeader";
import TopAppBar from "./components/TopAppBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { initializeAuth } from "./store/authSlice";
import { useAuth } from "./store/useAuth";



const BottomNav = () => {
  const location = useLocation();
  const { token } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  
  const hidePaths = ["/login"];
  
  // Fetch application status on mount and when location changes
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!token) return;
        
        const res = await fetch(apiConfig.application.getApplication, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          console.log('Fetched application status:', data.applicationStatus);
          setApplicationStatus(data.applicationStatus);
        }
      } catch (err) {
        console.error('Error fetching application status:', err);
      }
    };

    fetchStatus();
  }, [token, location.pathname]);
  
  // Hide if on specific paths or if application is submitted
  if (hidePaths.includes(location.pathname)) return null;
  if (applicationStatus === 'Submitted' || applicationStatus === 'approved' || applicationStatus === 'rejected') return null;
  
  const isActive = (path: string) => location.pathname === path;
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f0f8ff] flex justify-around items-center px-4 pb-safe h-20 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t-2 border-[#324670]">
      <Link to="/" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/") ? "bg-[#EC5A3B] text-white rounded-xl" : "text-[#324670]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/") ? "'FILL' 1" : "" }}>how_to_reg</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Register</span>
      </Link>
      <Link to="/basic-details" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/basic-details") ? "bg-[#EC5A3B] text-white rounded-xl" : "text-[#324670]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/basic-details") ? "'FILL' 1" : "" }}>person_book</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Details</span>
      </Link>
      <Link to="/documents" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/documents") ? "bg-[#EC5A3B] text-white rounded-xl" : "text-[#324670]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/documents") ? "'FILL' 1" : "" }}>upload_file</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Docs</span>
      </Link>
      <Link to="/preview" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/preview") ? "bg-[#EC5A3B] text-white rounded-xl" : "text-[#324670]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/preview") ? "'FILL' 1" : "" }}>visibility</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Preview</span>
      </Link>
    </nav>
  );
};

const AppHeader = () => {
  return (
    <>
      <MobileHeader />
      <TopAppBar />
    </>
  );
};

function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f8ff]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5A3B]"></div>
          <p className="mt-4 text-[#324670] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registration"
        element={
          <ProtectedRoute requireAuth={false}>
            <RegistrationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/otp"
        element={
          <ProtectedRoute requireAuth={false}>
            <OTPPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/basic-details"
        element={
          <ProtectedRoute requireAuth={true}>
            <BasicDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute requireAuth={true}>
            <DocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview"
        element={
          <ProtectedRoute requireAuth={true}>
            <PreviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thank-you"
        element={
          <ProtectedRoute requireAuth={true}>
            <ThankYouPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI">
      <Router basename="/career/registration">
        <div className="min-h-screen flex flex-col bg-[#f0f8ff] text-[#324670] selection:bg-[#EC5A3B] selection:text-white">
          <AppHeader />
          <AppContent />
          <BottomNav />
        </div>
      </Router>
    </GoogleReCaptchaProvider>
  );
}


