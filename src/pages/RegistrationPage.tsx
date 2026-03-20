import { useNavigate } from 'react-router';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';

function RegistrationPage() {
  const navigate = useNavigate();
  const plinth = "w-full bg-[#e5e2dd] border-b-2 border-[#8c7071] px-4 py-3 transition-all focus:border-[#570013] focus:outline-none focus:bg-white uppercase";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f4] text-[#1c1c19] font-['Inter']">

      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      <div className="md:hidden mt-16 px-4 pt-8 pb-32 flex-grow max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#fed488] text-[#775a19] text-[10px] font-bold tracking-widest uppercase mb-3 rounded-sm">
            Screen 01 / Registration
          </div>
          <h2 className="text-3xl font-['Public_Sans'] font-extrabold text-[#570013] tracking-tight leading-none mb-2">Basic Registration Form</h2>
        </div>

        <form className="space-y-8" onSubmit={handleFormSubmit}>
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Mobile No. (Username) <span className="text-[#ba1a1a]">*</span></label>
              <input className={plinth} maxLength={10} placeholder="10-DIGIT NUMERICAL" type="tel" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Candidate Name <span className="text-[#ba1a1a]">*</span></label>
              <input className={plinth} placeholder="FULL NAME" type="text" required />
              <p className="text-[11px] text-[#584141] italic">As per Record in the Matriculation / Secondary Examination Certificate</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Nationality <span className="text-[#ba1a1a]">*</span></label>
              <input className={plinth} placeholder="INDIAN" type="text" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Gender <span className="text-[#ba1a1a]">*</span></label>
              <select className={`${plinth} appearance-none`} required>
                <option value="">SELECT</option>
                <option value="male">MALE</option>
                <option value="female">FEMALE</option>
                <option value="other">TRANSGENDER</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">To which category do you belong <span className="text-[#ba1a1a]">*</span></label>
              <select className={`${plinth} appearance-none`} required>
                <option value="">SELECT CATEGORY</option>
                <option>GENERAL</option>
                <option>EWS</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#8c707133]">
              <h3 className="text-[#570013] font-bold text-lg mb-4">Personal Details ⇓</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1c1c19]">Date of Birth <span className="text-[#ba1a1a]">*</span></label>
                  <input className={`${plinth} normal-case`} type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1c1c19]">Email <span className="text-[#ba1a1a]">*</span></label>
                  <input className={plinth} placeholder="EXAMPLE@DOMAIN.COM" type="email" required />
                  <p className="text-[11px] text-[#584141] italic">Enter your current and Active E-mail Address</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f6f3ee] p-6 rounded-xl space-y-4">
            <div className="bg-white p-4 flex items-center justify-center rounded border border-[#e0bfbf] select-none">
              <span className="font-['Public_Sans'] italic font-black text-2xl tracking-[0.4em] opacity-80 text-[#584141]">X G 7 2 R P</span>
            </div>
            <input className={plinth} placeholder="ENTER CAPTCHA TEXT" type="text" required />
          </section>

          <button className="w-full bg-[#570013] text-white py-4 px-6 rounded-lg font-bold" type="submit">Verify Email &amp; Register</button>
        </form>
        <Footer />
      </div>

      {/* ══ DESKTOP LAYOUT ═══════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <main className="flex-grow flex w-full max-w-7xl mx-auto px-8 py-12">
          <SideNavBar activePath="/" />
          <div className="flex-1">
             <div className="mb-16">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#ebe8e3] -z-10"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#775a19] text-white flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Registration</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#570013] text-white flex items-center justify-center font-bold shadow-md">2</div>
                  <span className="text-sm font-['Inter'] text-[#570013] font-semibold">Basic Details</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ebe8e3] text-stone-400 flex items-center justify-center">3</div>
                  <span className="text-xs font-['Inter'] text-stone-500">Documents</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ebe8e3] text-stone-400 flex items-center justify-center">4</div>
                  <span className="text-xs font-['Inter'] text-stone-500">Preview</span>
                </div>
              </div>
            </div>
            <header className="mb-16">
              <h1 className="font-['Public_Sans'] text-[3.5rem] leading-none font-extrabold tracking-tighter text-[#570013]">Basic Registration Form</h1>
              <div className="h-1 w-24 bg-[#775a19] mt-6"></div>
            </header>
            
            <section className="grid grid-cols-[1fr_2fr] gap-16">
              <div className="space-y-6">
                <div className="sticky top-24">
                  <h3 className="font-['Public_Sans'] text-xl font-bold text-[#570013] mb-4">Initial Verification</h3>
                  <p className="text-[#584141] leading-relaxed text-sm">Please provide your primary contact information. Ensure all details match your official documents.</p>
                </div>
              </div>

              <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50">
                <form className="space-y-10" onSubmit={handleFormSubmit}>
                  {/* Fields in requested order */}
                  <div className="space-y-2">
                    <label className="font-medium text-sm flex items-center">Mobile No. (Username)<span className="text-[#ba1a1a] ml-1">*</span></label>
                    <input className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors font-mono tracking-widest text-lg" maxLength={10} placeholder="10-DIGIT NUMERICAL" type="text" required />
                    <p className="text-[10px] text-[#584141] uppercase tracking-wider">Mandatory 10 digit numerical</p>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-sm flex items-center">Enter Candidate name as per matriculation certificate <span className="text-[#ba1a1a] ml-1">*</span></label>
                    <input className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors uppercase" placeholder="ENTER FULL NAME" type="text" required />
                    <p className="text-[10px] text-[#584141] uppercase tracking-wider">As per Record in the Matriculation / Secondary Examination Certificate</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-medium text-sm flex items-center">Nationality <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors uppercase" placeholder="INDIAN" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium text-sm flex items-center">Gender <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <select className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none appearance-none" required defaultValue="">
                        <option disabled value="">SELECT GENDER</option>
                        <option>MALE</option><option>FEMALE</option><option>TRANSGENDER</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-sm flex items-center">To which category do you belong <span className="text-[#ba1a1a] ml-1">*</span></label>
                    <select className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none appearance-none" required defaultValue="">
                      <option disabled value="">SELECT CATEGORY</option>
                      <option>GENERAL</option><option>EWS</option><option>OBC</option><option>SC</option><option>ST</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-[#8c707133]">
                    <h3 className="text-[#570013] font-['Public_Sans'] font-bold text-xl mb-8">Personal Details ⇓</h3>
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <label className="font-medium text-sm flex items-center">Date of Birth <span className="text-[#ba1a1a] ml-1">*</span></label>
                        <input className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <label className="font-medium text-sm flex items-center">Email <span className="text-[#ba1a1a] ml-1">*</span></label>
                        <input className="w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none" placeholder="active.email@domain.com" type="email" required />
                        <p className="text-[10px] text-[#584141] uppercase tracking-wider">Enter your current and Active E-mail Address</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#f0ede8] rounded-xl border-l-4 border-[#775a19]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white p-4 rounded shadow-inner">
                        <span className="font-['Public_Sans'] italic text-2xl tracking-[0.5em] text-stone-300 line-through decoration-[#570013]">R 8 X T 2</span>
                      </div>
                      <button className="material-symbols-outlined text-[#775a19] p-2" type="button">refresh</button>
                    </div>
                    <input className="w-full bg-white p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none uppercase" placeholder="ENTER CAPTCHA TEXT" type="text" required />
                  </div>

                  <div className="pt-6">
                    <button className="w-full bg-[#570013] text-white py-5 px-8 rounded-lg font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#800020] transition-all flex items-center justify-center gap-3" type="submit">
                      Verify Email &amp; Register <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default RegistrationPage;