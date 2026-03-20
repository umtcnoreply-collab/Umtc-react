import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function OTPPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">
      {/* ══ MOBILE ══════════════════════════════════════════════ */}
      <div className="md:hidden pt-24 pb-32 px-6 min-h-screen flex flex-col max-w-md mx-auto w-full">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-[#fed488] text-[#775a19] font-['Inter'] text-[10px] uppercase tracking-widest rounded-full mb-4">
            Identity Verification
          </div>
          <h1 className="font-['Public_Sans'] font-extrabold text-3xl text-[#570013] leading-tight tracking-tight mb-4">Verify Your Sovereignty</h1>
          <p className="text-[#584141] leading-relaxed text-sm">
            A unique 6-digit code has been dispatched to your registered email address.
          </p>
        </header>
        <section className="bg-[#f6f3ee] p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#570013]"></div>
          <div className="flex flex-col gap-8">
            <div>
              <label className="block font-['Public_Sans'] font-bold text-sm text-[#570013] uppercase tracking-widest mb-6">Enter Security Code</label>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input key={i} className="w-10 h-14 text-center text-2xl font-['Public_Sans'] font-bold bg-[#e5e2dd] border-b-2 border-[#8c7071] rounded-t-lg transition-all focus:bg-white focus:border-[#570013] focus:outline-none" maxLength={1} placeholder="•" type="text" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate("/basic-details")} className="w-full bg-[#570013] hover:bg-[#800020] text-white py-4 px-6 rounded-xl font-['Public_Sans'] font-bold text-sm tracking-wide shadow-sm active:scale-[0.98] transition-all">
                Submit OTP &amp; Finalize Registration
              </button>
              <button className="w-full bg-[#e5e2dd] text-[#1c1c19] py-4 px-6 rounded-xl font-['Public_Sans'] font-bold text-sm tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">refresh</span> Resend OTP
              </button>
            </div>
          </div>
        </section>
        <section className="mt-8 flex gap-4 items-start p-4 bg-white/50 rounded-lg">
          <span className="material-symbols-outlined text-[#775a19]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <div>
            <h4 className="font-['Public_Sans'] font-bold text-xs text-[#570013] uppercase tracking-tighter">Encrypted Handshake</h4>
            <p className="text-[11px] text-[#584141] leading-normal mt-1">Session protected by 256-bit institutional-grade encryption.</p>
          </div>
        </section>
        <Footer />
      </div>

      {/* ══ DESKTOP ═════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <main className="flex-grow flex items-center justify-center px-4 py-12 bg-stone-100">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-0 bg-white overflow-hidden shadow-2xl rounded-xl">
            <div className="md:col-span-5 bg-[#800020] p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="z-10">
                <span className="text-[#fed488] font-['Public_Sans'] font-bold tracking-widest uppercase text-xs">Security Protocol</span>
                <h1 className="font-['Public_Sans'] text-4xl font-extrabold mt-4 mb-6 leading-tight">Identity Verification</h1>
                <p className="text-[#ff828a] text-lg leading-relaxed opacity-90">Security code dispatched to your registered email.</p>
              </div>
            </div>
            <div className="md:col-span-7 p-10 md:p-16 flex flex-col justify-center bg-[#fcf9f4]">
              <div className="mb-10">
                <h2 className="font-['Public_Sans'] text-2xl font-bold text-[#570013] mb-2">Enter Verification Code</h2>
                <p className="text-[#584141]">A 6-digit code was sent to <span className="font-semibold text-[#1c1c19]">ad***@example.gov</span></p>
              </div>
              <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); navigate("/basic-details"); }}>
                <div className="flex justify-between gap-2 md:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input key={i} className="w-full h-16 text-center text-2xl font-bold bg-[#ebe8e3] border-b-2 border-[#8c7071] focus:border-[#570013] focus:outline-none transition-colors" maxLength={1} placeholder="•" type="text" />
                  ))}
                </div>
                <button className="w-full bg-[#570013] hover:bg-[#800020] text-white py-4 rounded-lg font-['Public_Sans'] font-semibold tracking-wide shadow-md transition-all active:scale-95" type="submit">
                  Submit OTP &amp; Finalize Registration
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default OTPPage
