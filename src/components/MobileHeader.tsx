
function MobileHeader() {
  return (
  <header className="md:hidden bg-[#fcf9f4]/80 backdrop-blur-md fixed top-0 w-full z-50">
    <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#570013]">account_balance</span>
        <h1 className="text-xl font-black text-[#570013] tracking-[-0.02em] font-['Public_Sans']">THE SOVEREIGN</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-[#570013]">notifications</span>
      </div>
    </div>
  </header>
)
}

export default MobileHeader
