import { Link } from 'react-router-dom';

type SideNavBarProps = {
  activePath: string;
};

function SideNavBar({ activePath }: SideNavBarProps) {
  const navItems = [
    { path: "/", icon: "assignment", label: "Registration Info" },
    { path: "/basic-details", icon: "person", label: "Basic Details" },
    { path: "/documents", icon: "description", label: "Documents" },
    { path: "/preview", icon: "visibility", label: "Preview" },
  ];
  return (
    <aside className="hidden md:flex flex-col h-full w-64 p-6 space-y-4 bg-[#f0f8ff] rounded-xl mr-12 min-h-[calc(100vh-120px)] sticky top-24">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#324670]">Candidate Portal</h2>
        <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Examination 2024</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              activePath === item.path
                ? "bg-[#800020] text-white shadow-sm font-medium"
                : "text-stone-600 hover:bg-stone-200 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <button className="mt-auto py-3 px-4 bg-[#e8f4ff] text-[#1c1c19] text-sm font-semibold rounded-lg hover:bg-[#dcdad5] transition-colors">
        Save &amp; Exit
      </button>
    </aside>
  );
};

export default SideNavBar

