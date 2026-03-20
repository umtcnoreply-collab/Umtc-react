import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import BasicDetailsPage from "./pages/BasicDetailsPage";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import DocumentsPage from "./pages/DocumentsPage";
import PreviewPage from "./pages/PreviewPage";
import MobileHeader from "./components/MobileHeader";
import TopAppBar from "./components/TopAppBar";



const BottomNav = () => {
  const location = useLocation();
  const hidePaths = ["/login"];
  if (hidePaths.includes(location.pathname)) return null;
  const isActive = (path) => location.pathname === path;
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#fcf9f4] flex justify-around items-center px-4 pb-safe h-20 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t-2 border-[#e5e2dd]">
      <Link to="/" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/") ? "bg-[#fed488] text-[#570013] rounded-xl" : "text-[#4e4639]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/") ? "'FILL' 1" : "" }}>how_to_reg</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Register</span>
      </Link>
      <Link to="/basic-details" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/basic-details") ? "bg-[#fed488] text-[#570013] rounded-xl" : "text-[#4e4639]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/basic-details") ? "'FILL' 1" : "" }}>person_book</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Details</span>
      </Link>
      <Link to="/documents" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/documents") ? "bg-[#fed488] text-[#570013] rounded-xl" : "text-[#4e4639]"}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("/documents") ? "'FILL' 1" : "" }}>upload_file</span>
        <span className="font-['Inter'] text-[10px] font-medium leading-tight">Docs</span>
      </Link>
      <Link to="/preview" className={`flex flex-col items-center justify-center px-3 py-1 transition-all duration-300 ${isActive("/preview") ? "bg-[#fed488] text-[#570013] rounded-xl" : "text-[#4e4639]"}`}>
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


export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#fcf9f4] text-[#1c1c19] selection:bg-[#fed488]">
        <AppHeader />
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OTPPage />} />
          <Route path="/basic-details" element={<BasicDetailsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
