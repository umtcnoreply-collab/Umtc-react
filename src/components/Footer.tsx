

function Footer() {
  return (
  <>
    <footer className="hidden md:block bg-[#f0f8ff] text-[#324670] font-['Inter'] text-xs leading-relaxed w-full mt-auto">
      <div className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="font-semibold text-stone-900 mx-auto">© 2013 Urban Mass Transit Company Limited, All rights reserved | Designed & Developed by v2Web</div>
      </div>
    </footer>
    <footer className="md:hidden w-full mt-auto py-12 px-6 bg-[#f0f8ff] text-center border-t border-[#e5e2dd]/20">
      <div className="flex flex-col items-center space-y-4 w-full">
        <p className="text-[#4e4639] text-xs leading-relaxed tracking-wide">© 2013 Urban Mass Transit Company Limited, All rights reserved | Designed & Developed by v2Web</p>
      </div>
    </footer>
  </>
)
}

export default Footer



