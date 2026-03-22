import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../store/useAuth';
import { apiConfig } from '../config/apiConfig';

type SideNavBarProps = {
  activePath: string;
};

function SideNavBar({ activePath }: SideNavBarProps) {
  const { token } = useAuth();
  const [basicDone, setBasicDone] = useState(false);
  const [docsDone, setDocsDone] = useState(false);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        if (!token) return;
        const res = await fetch(apiConfig.application.getApplication, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setBasicDone(!!(data.basicDetails?.motherName && data.basicDetails?.fatherName));
          setDocsDone(!!(data.documents?.photoUrl && data.documents?.signatureUrl));
        }
      } catch (err) {
        console.error('SideNavBar: Error fetching stage:', err);
      }
    };
    fetchStage();
  }, [token]);

  const navItems = [
    { path: "/", icon: "assignment", label: "Registration Info" },
    { path: "/basic-details", icon: "person", label: "Basic Details" },
    { path: "/documents", icon: "description", label: "Documents" },
    { path: "/preview", icon: "visibility", label: "Preview" },
  ];

  const isLocked = (path: string) => {
    if (path === '/documents') return !basicDone;
    if (path === '/preview') return !docsDone;
    return false;
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-64 p-6 space-y-4 bg-[#f0f8ff] rounded-xl mr-12 min-h-[calc(100vh-120px)] sticky top-24">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#324670]">Candidate Portal</h2>
        <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Examination 2024</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const locked = isLocked(item.path);
          return locked ? (
            <div
              key={item.path}
              className="flex items-center gap-3 p-3 rounded-lg text-stone-400 cursor-not-allowed opacity-50"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
              <span className="material-symbols-outlined text-base ml-auto">lock</span>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                activePath === item.path
                  ? "bg-[#9fcb54] text-white shadow-sm font-medium"
                  : "text-stone-600 hover:bg-stone-200 hover:translate-x-1"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button className="mt-auto py-3 px-4 bg-[#e8f4ff] text-[#1c1c19] text-sm font-semibold rounded-lg hover:bg-[#dcdad5] transition-colors">
        Save &amp; Exit
      </button>
    </aside>
  );
};

export default SideNavBar



