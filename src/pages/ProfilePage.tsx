import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';
import { useAuth } from '../store/useAuth';
import { apiConfig } from '../config/apiConfig';

function ProfilePage() {
  const navigate = useNavigate();
  const { token, handleLogout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiConfig.application.getApplication, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; color: string; icon: string } } = {
      submitted: { bg: 'bg-blue-100', color: 'text-blue-800', icon: 'check_circle' },
      pending: { bg: 'bg-yellow-100', color: 'text-yellow-800', icon: 'schedule' },
      approved: { bg: 'bg-green-100', color: 'text-green-800', icon: 'verified' },
      rejected: { bg: 'bg-red-100', color: 'text-red-800', icon: 'cancel' }
    };

    const badge = statusMap[status] || statusMap.pending;
    return badge;
  };

  if (loading) {
    return (
      <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-[#570013] animate-spin mb-4 inline-block">hourglass_bottom</span>
          <p className="text-lg font-semibold text-[#570013]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">
      {/* Mobile View */}
      <div className="md:hidden flex flex-col flex-grow pt-20 px-4 pb-20">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-['Public_Sans'] font-black text-[#570013]">My Profile</h1>
              <p className="text-sm text-[#584141] mt-2">Your application details and status</p>
            </div>
            <button
              onClick={onLogout}
              className="p-3 hover:bg-[#e5e2dd] rounded-full transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
          <div className="h-1 w-12 bg-[#775a19] rounded-full"></div>
        </div>

        {error && (
          <div className="bg-[#ffebee] border border-[#ba1a1a] text-[#ba1a1a] p-4 rounded-lg text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        {profile && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-[#570013] to-[#800020] text-white rounded-xl p-6 shadow-lg">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2">Candidate Name</p>
              <h2 className="text-2xl font-['Public_Sans'] font-bold mb-4">{profile.candidateName}</h2>
              <div className="space-y-2">
                <p className="text-sm"><span className="opacity-80">📧</span> {profile.email}</p>
                <p className="text-sm"><span className="opacity-80">📱</span> {profile.mobile}</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white border-2 border-[#ebe8e3] rounded-xl p-6">
              <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold mb-3">Application Status</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${getStatusBadge(profile.status || 'pending').bg} rounded-full flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-xl ${getStatusBadge(profile.status || 'pending').color}`}>
                    {getStatusBadge(profile.status || 'pending').icon}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#570013] capitalize">{profile.status || 'Submitted'}</p>
                  <p className="text-xs text-[#584141]">Submitted on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-[#f0ede8] rounded-lg p-4 border border-[#ebe8e3]">
                <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold mb-2">Basic Info</p>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-semibold">DOB:</span> {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-sm"><span className="font-semibold">Gender:</span> <span className="capitalize">{profile.gender}</span></p>
                  <p className="text-sm"><span className="font-semibold">Category:</span> <span className="uppercase">{profile.category}</span></p>
                </div>
              </div>

              <div className="bg-[#f0ede8] rounded-lg p-4 border border-[#ebe8e3]">
                <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold mb-2">Address</p>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-semibold">City:</span> {profile.address?.permanentAddress?.city || 'N/A'}</p>
                  <p className="text-sm"><span className="font-semibold">State:</span> {profile.address?.permanentAddress?.state || 'N/A'}</p>
                  <p className="text-sm"><span className="font-semibold">State:</span> {profile.address?.permanentAddress?.pincode || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#ebe8e3]">
              <button
                onClick={() => navigate('/preview')}
                className="w-full py-3 bg-[#570013] text-white rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">visibility</span>
                View Application
              </button>
              <button
                onClick={onLogout}
                className="w-full py-3 bg-[#ebe8e3] text-[#1c1c19] rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* <Footer /> */}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col flex-grow">
        <div className="flex-grow flex w-full max-w-7xl mx-auto px-8 py-12 gap-12">
          {/* <SideNavBar activePath="/profile" /> */}

          <main className="flex-1">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-5xl font-['Public_Sans'] font-black text-[#570013] mb-2">My Profile</h1>
                <p className="text-lg text-[#584141]">Your application details and status</p>
                <div className="w-24 h-1 bg-[#775a19] mt-4"></div>
              </div>
              <button
                onClick={onLogout}
                className="px-6 py-3 bg-[#ba1a1a] text-white rounded-lg font-bold hover:bg-[#d32f2f] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>

            {error && (
              <div className="bg-[#ffebee] border-2 border-[#ba1a1a] text-[#ba1a1a] p-6 rounded-lg text-base font-semibold mb-8">
                {error}
              </div>
            )}

            {profile && (
              <div className="space-y-12">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#570013] to-[#800020] text-white rounded-2xl p-8 shadow-lg h-full flex flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest opacity-80 mb-4">Candidate Profile</p>
                        <h2 className="text-4xl font-['Public_Sans'] font-black mb-6">{profile.candidateName}</h2>
                        <div className="space-y-3">
                          <p className="text-sm"><span>📧</span> {profile.email}</p>
                          <p className="text-sm"><span>📱</span> {profile.mobile}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border-2 border-[#ebe8e3] rounded-2xl p-8 shadow-md h-full">
                      <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold mb-6">Application Status</p>
                      <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 ${getStatusBadge(profile.status || 'pending').bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className={`material-symbols-outlined text-4xl ${getStatusBadge(profile.status || 'pending').color}`}>
                            {getStatusBadge(profile.status || 'pending').icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-3xl font-['Public_Sans'] font-bold text-[#570013] capitalize">{profile.status || 'Submitted'}</p>
                          <p className="text-sm text-[#584141] mt-2">Submitted on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          <p className="text-xs text-[#775a19] font-semibold mt-3">✓ In Review - Expected response within 48 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="bg-[#f6f3ee] rounded-2xl p-8 border border-[#ebe8e3]">
                    <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013] mb-6 border-b border-[#ebe8e3] pb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Date of Birth</p>
                        <p className="text-lg font-medium">{profile.dob ? new Date(profile.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Gender</p>
                        <p className="text-lg font-medium capitalize">{profile.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Nationality</p>
                        <p className="text-lg font-medium capitalize">{profile.nationality}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Category</p>
                        <p className="text-lg font-medium uppercase">{profile.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Address */}
                  <div className="bg-[#f6f3ee] rounded-2xl p-8 border border-[#ebe8e3]">
                    <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013] mb-6 border-b border-[#ebe8e3] pb-4">Contact & Address</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Email</p>
                        <p className="text-lg font-medium break-all">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Mobile</p>
                        <p className="text-lg font-medium">{profile.mobile}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">City</p>
                        <p className="text-lg font-medium">{profile.address?.permanentAddress?.city || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Pin Code</p>
                        <p className="text-lg font-medium">{profile.address?.permanentAddress?.pincode || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="bg-[#f6f3ee] rounded-2xl p-8 border border-[#ebe8e3]">
                    <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013] mb-6 border-b border-[#ebe8e3] pb-4">Family Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Father's Name</p>
                        <p className="text-lg font-medium">{profile.basicDetails?.fatherName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Mother's Name</p>
                        <p className="text-lg font-medium">{profile.basicDetails?.motherName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Legal & Status */}
                  <div className="bg-[#f6f3ee] rounded-2xl p-8 border border-[#ebe8e3]">
                    <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013] mb-6 border-b border-[#ebe8e3] pb-4">Legal & Status</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Debarred</p>
                        <p className="text-lg font-medium">{profile.basicDetails?.debarred ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">FIR Against</p>
                        <p className="text-lg font-medium">{profile.basicDetails?.fir ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Government Employee</p>
                        <p className="text-lg font-medium">{profile.basicDetails?.govt_emp ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#775a19] font-bold">Aadhar Number</p>
                        <p className="text-lg font-medium">{profile.basicDetails?.aadhar || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 pt-8 border-t border-[#ebe8e3]">
                  <button
                    onClick={() => navigate('/preview')}
                    className="px-10 py-4 bg-[#570013] text-white rounded-lg font-bold hover:bg-[#800020] transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                    View Full Application
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-10 py-4 bg-[#ebe8e3] text-[#1c1c19] rounded-lg font-bold hover:bg-[#dcdad5] transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">print</span>
                    Print Profile
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default ProfilePage;
