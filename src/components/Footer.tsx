

function Footer() {
  return (
  <>
    <footer className="hidden md:block bg-[#f0f8ff] text-[#324670] font-['Inter'] text-xs leading-relaxed w-full mt-auto">
      <div className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="font-semibold text-stone-900">© 2024 The Sovereign Editorial. All Rights Reserved.</div>
        <div className="flex gap-8">
          <a className="text-stone-500 hover:text-[#9fcb54] transition-colors" href="#">Privacy Policy</a>
          <a className="text-stone-500 hover:text-[#9fcb54] transition-colors" href="#">Terms of Service</a>
          <a className="text-stone-500 hover:text-[#9fcb54] transition-colors" href="#">Accessibility</a>
          <a className="text-stone-500 hover:text-[#9fcb54] transition-colors" href="#">Support</a>
        </div>
      </div>
    </footer>
    <footer className="md:hidden w-full mt-auto py-12 px-6 bg-[#f0f8ff] text-center border-t border-[#e5e2dd]/20">
      <div className="flex flex-col items-center space-y-4 w-full">
        <span className="font-['Public_Sans'] font-bold text-[#324670]">THE SOVEREIGN</span>
        <div className="flex flex-wrap justify-center gap-4">
          <a className="text-[#4e4639] text-xs leading-relaxed tracking-wide hover:text-[#324670] transition-colors" href="#">Privacy Policy</a>
          <a className="text-[#4e4639] text-xs leading-relaxed tracking-wide hover:text-[#324670] transition-colors" href="#">Terms of Service</a>
          <a className="text-[#4e4639] text-xs leading-relaxed tracking-wide hover:text-[#324670] transition-colors" href="#">Contact Support</a>
        </div>
        <p className="text-[#4e4639] text-xs leading-relaxed tracking-wide">© 2024 The Sovereign Editorial. All Rights Reserved.</p>
      </div>
    </footer>
  </>
)
}

export default Footer



