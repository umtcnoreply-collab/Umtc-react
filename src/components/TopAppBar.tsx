import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';

function TopAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
  <nav className="hidden md:flex bg-[#f0f8ff]/80 backdrop-blur-md text-[#324670] font-['Public_Sans'] tracking-tight top-0 sticky z-50">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
      <Link to={isAuthenticated ? "/basic-details" : "/login"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="https://umtcapply.com/wp-content/uploads/2026/01/logo-new-1.png" alt="UMTC Logo" className="h-12 w-12" />
        <div>
          <div className="text-sm font-bold text-[#324670]">Urban Mass Transit</div>
          <div className="text-sm font-bold text-[#324670]">Company Limited</div>
        </div>
      </Link>
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4 ml-4">
          <button className="material-symbols-outlined hover:bg-[#f0f8ff] p-2 rounded-full transition-all">notifications</button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="material-symbols-outlined hover:bg-[#f0f8ff] p-2 rounded-full transition-all text-[#324670]"
              title="Logout"
            >
              logout
            </button>
          )}
          {!isAuthenticated && (
            <button className="material-symbols-outlined hover:bg-[#f0f8ff] p-2 rounded-full transition-all">account_circle</button>
          )}
        </div>
      </div>
    </div>
  </nav>
)

}

export default TopAppBar



