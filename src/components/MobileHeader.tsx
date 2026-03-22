
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';

function MobileHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
  <header className="md:hidden bg-[#f0f8ff]/80 backdrop-blur-md fixed top-0 w-full z-50">
    <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <img src="https://umtcapply.com/wp-content/uploads/2026/01/logo-new-1.png" alt="UMTC Logo" className="h-10 w-10" />
        <h1 className="text-sm font-bold text-[#324670] tracking-tight font-['Public_Sans']">Urban Mass Transit<br/>Company Limited</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-[#324670]">notifications</span>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="material-symbols-outlined text-[#324670] hover:bg-[#e8f4ff] p-2 rounded-full transition-all"
            title="Logout"
          >
            logout
          </button>
        )}
      </div>
    </div>
  </header>
)
}

export default MobileHeader



