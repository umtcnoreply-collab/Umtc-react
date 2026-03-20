import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';


function LoginPage() {
  const navigate = useNavigate();
  const plinth = "w-full bg-[#e5e2dd] border-b-2 border-[#8c7071] px-4 py-3 transition-all focus:border-[#570013] focus:outline-none focus:bg-white uppercase";

  return (
    <div className="bg-[#fcf9f4] font-['Inter'] text-[#1c1c19] min-h-screen flex flex-col">
      {/* ══ MOBILE ══════════════════════════════════════════════ */}
      <div className="md:hidden flex-grow pt-24 pb-12 px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-10">
          <div className="space-y-2">
            <h1 className="font-['Public_Sans'] text-[2rem] font-extrabold text-[#570013] tracking-tight leading-none">Candidate Login</h1>
            <div className="w-12 h-1 bg-[#775a19]"></div>
            <p className="text-[#584141] text-sm mt-4 font-medium italic">Access your editorial portal with institutional credentials.</p>
          </div>
          <section className="bg-[#f6f3ee] p-8 rounded-xl space-y-8">
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold text-[#584141] tracking-wider uppercase flex items-center">
                Mobile Number <span className="text-[#ba1a1a] ml-1">*</span>
              </label>
              <input className={plinth} placeholder="ENTER REGISTERED MOBILE" type="text" />
            </div>
            <div className="space-y-4">
              <label className="font-['Inter'] text-xs font-semibold text-[#584141] tracking-wider uppercase">
                Verification Captcha <span className="text-[#ba1a1a] ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="bg-white p-2 rounded-lg border border-[#e0bfbf]/30 flex items-center justify-center shadow-sm h-14">
                  <span className="text-lg font-['Public_Sans'] font-black italic tracking-[0.3em] text-[#570013] opacity-70">R7G2K9</span>
                </div>
                <button className="flex items-center justify-center text-[#570013] font-bold text-xs gap-2 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-base">refresh</span> REFRESH
                </button>
              </div>
              <input className={plinth} placeholder="TYPE CAPTCHA ABOVE" type="text" />
            </div>
            <button onClick={() => navigate("/basic-details")} className="w-full bg-[#570013] text-white py-5 rounded-lg font-['Public_Sans'] font-bold text-sm tracking-widest shadow-lg active:scale-[0.98]">
              GET EMAIL OTP FOR LOGIN
            </button>
            <div className="flex justify-center pt-2">
              <Link to="/" className="text-xs font-bold text-[#8e0f28] border-b border-[#775a19] hover:text-[#570013] transition-colors">
                BACK TO REGISTRATION
              </Link>
            </div>
          </section>
        </div>
        <Footer />
      </div>

      {/* ══ DESKTOP ═════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <p className="text-[#775a19] font-semibold uppercase tracking-widest text-xs">Access Portal</p>
                <h1 className="text-5xl font-['Public_Sans'] font-extrabold text-[#570013] leading-tight tracking-tighter">Candidate Login</h1>
                <div className="h-1 w-20 bg-[#775a19] mt-4"></div>
              </div>
              <p className="text-[#584141] leading-relaxed text-sm">Secure access to your national examination dashboard.</p>
              <div className="p-6 bg-[#f6f3ee] rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#775a19]">security</span>
                  <div>
                    <p className="font-medium text-sm">Secure Authentication</p>
                    <p className="text-xs text-[#584141]">Multi-factor authentication enabled.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 bg-white p-10 shadow-sm rounded-xl">
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate("/"); }}>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#584141]">MOBILE NUMBER <span className="text-[#ba1a1a]">*</span></label>
                    <input className="border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors py-3 px-4 uppercase font-bold text-[#570013] tracking-widest w-full bg-[#ebe8e3]" placeholder="ENTER 10 DIGIT NUMBER" type="text" required />
                  </div>
                  <button className="w-full bg-[#800020] text-white py-4 font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg" type="button">
                    GET EMAIL OTP FOR LOGIN <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e0bfbf]/30"></div></div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs font-semibold text-[#775a19] uppercase tracking-widest">OTP Verification</span>
                  </div>
                </div>
                <div className="space-y-6 bg-[#f6f3ee]/50 p-6 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#584141]">ENTER EMAIL OTP <span className="text-[#ba1a1a]">*</span></label>
                    <input className="border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors py-3 px-4 uppercase font-bold text-[#570013] tracking-[0.5em] w-full text-center bg-[#ebe8e3]" maxLength={6} placeholder="SIX DIGIT CODE" type="text" />
                  </div>
                  <button className="w-full bg-[#570013] text-white py-4 font-bold rounded-lg hover:bg-[#800020] transition-all uppercase tracking-widest shadow-xl" type="submit">LOGIN</button>
                </div>
              </form>
              <div className="mt-8 text-center">
                <p className="text-xs text-[#584141]">Don&apos;t have an account? <Link className="text-[#570013] font-semibold underline underline-offset-4 hover:text-[#775a19]" to="/">Register as New Candidate</Link></p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};


export default LoginPage
