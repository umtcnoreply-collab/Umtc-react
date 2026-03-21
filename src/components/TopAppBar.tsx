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
  <nav className="hidden md:flex bg-[#fcf9f4]/80 backdrop-blur-md text-[#570013] font-['Public_Sans'] tracking-tight top-0 sticky z-50">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
      <Link to={isAuthenticated ? "/basic-details" : "/login"} className="text-xl font-bold text-[#570013] uppercase tracking-wider">
        The Sovereign Editorial
      </Link>
      <div className="flex items-center space-x-8">
        {!isAuthenticated && (
          <>
            <Link className="text-stone-600 hover:text-[#570013] transition-colors" to="/">Dashboard</Link>
            <a className="text-stone-600 hover:text-[#570013] transition-colors" href="#">Help Desk</a>
            <a className="text-stone-600 hover:text-[#570013] transition-colors" href="#">Contact</a>
          </>
        )}
        <div className="flex items-center space-x-4 ml-4">
          <button className="material-symbols-outlined hover:bg-[#f6f3ee] p-2 rounded-full transition-all">notifications</button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="material-symbols-outlined hover:bg-[#f6f3ee] p-2 rounded-full transition-all text-[#570013]"
              title="Logout"
            >
              logout
            </button>
          )}
          {!isAuthenticated && (
            <button className="material-symbols-outlined hover:bg-[#f6f3ee] p-2 rounded-full transition-all">account_circle</button>
          )}
        </div>
      </div>
    </div>
  </nav>
)

}

export default TopAppBar
