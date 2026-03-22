import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { apiConfig } from '../config/apiConfig';

function RegistrationPage() {
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const plinth = "w-full bg-[#e5e2dd] border-b-2 border-[#324670] px-4 py-3 transition-all focus:border-[#324670] focus:outline-none focus:bg-white uppercase";

  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    candidateName: '',
    dob: '',
    gender: '',
    nationality: '',
    category: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get reCAPTCHA token
      if (!executeRecaptcha) {
        setError('reCAPTCHA is not available. Please refresh the page.');
        setLoading(false);
        return;
      }

      const token = await executeRecaptcha('register');

      const res = await fetch(apiConfig.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, recaptchaToken: token })
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      // store email for OTP page
      localStorage.setItem('email', formData.email);

      // go to OTP page
      navigate('/otp');

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Server error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f8ff] text-[#1c1c19] font-['Inter']">

      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      <div className="md:hidden mt-16 px-4 pt-8 pb-32 flex-grow max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#fed488] text-[#9fcb54] text-[10px] font-bold tracking-widest uppercase mb-3 rounded-sm">
            Screen 01 / Registration
          </div>
          <h2 className="text-3xl font-['Public_Sans'] font-extrabold text-[#324670] tracking-tight leading-none mb-2">Basic Registration Form</h2>
        </div>

        <form className="space-y-8" onSubmit={handleFormSubmit}>
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Mobile No. (Username) <span className="text-[#c80000]">*</span></label>
              <input name='mobile' value={formData.mobile} onChange={handleChange} className={plinth} maxLength={10} placeholder="10-DIGIT NUMERICAL" type="tel" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Candidate Name <span className="text-[#c80000]">*</span></label>
              <input name='candidateName' value={formData.candidateName} onChange={handleChange} className={plinth} placeholder="FULL NAME" type="text" required />
              <p className="text-[11px] text-[#324670] italic">As per Record in the Matriculation / Secondary Examination Certificate</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Nationality <span className="text-[#c80000]">*</span></label>
              <input name='nationality' value={formData.nationality} onChange={handleChange} className={plinth} placeholder="INDIAN" type="text" required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Gender <span className="text-[#c80000]">*</span></label>
              <select name='gender' value={formData.gender} onChange={handleChange} className={`${plinth} appearance-none`} required>
                <option value="">SELECT</option>
                <option value="male">MALE</option>
                <option value="female">FEMALE</option>
                <option value="other">TRANSGENDER</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">To which category do you belong <span className="text-[#c80000]">*</span></label>
              <select name='category' value={formData.category} onChange={handleChange} className={`${plinth} appearance-none`} required>
                <option value="">SELECT CATEGORY</option>
                <option value="general">GENERAL</option>
                <option value="ews">EWS</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#32467033]">
              <h3 className="text-[#324670] font-bold text-lg mb-4">Personal Details ⇓</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1c1c19]">Date of Birth <span className="text-[#c80000]">*</span></label>
                  <input name="dob" onChange={handleChange} value={formData.dob} className={`${plinth} normal-case`} type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1c1c19]">Email <span className="text-[#c80000]">*</span></label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={plinth}
                    placeholder="EXAMPLE@DOMAIN.COM"
                    type="email"
                    required
                  />                  <p className="text-[11px] text-[#324670] italic">Enter your current and Active E-mail Address</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f0f8ff] p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-[#324670] text-xl flex-shrink-0">verified</span>
              <p className="text-[#324670]"><strong>Protected by reCAPTCHA</strong> - This registration is verified to prevent automated abuse.</p>
            </div>
          </section>

          {error && (
            <div className="bg-[#ffebee] border-l-4 border-[#c80000] p-4 rounded text-sm font-semibold text-[#c80000]">
              {error}
            </div>
          )}

          <button disabled={loading} className="w-full bg-[#324670] text-white py-4 px-6 rounded-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" type="submit">
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">hourglass_bottom</span>
                Verifying...
              </>
            ) : (
              <>
                Verify Email &amp; Register
              </>
            )}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-[#1c1c19]">Already have an account? <Link to="/" className="font-semibold text-[#324670] hover:underline">Login here</Link></p>
          </div>
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
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#e8f4ff] -z-10"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#9fcb54] text-white flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Registration</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#324670] text-white flex items-center justify-center font-bold shadow-md">2</div>
                  <span className="text-sm font-['Inter'] text-[#324670] font-semibold">Basic Details</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e8f4ff] text-stone-400 flex items-center justify-center">3</div>
                  <span className="text-xs font-['Inter'] text-stone-500">Documents</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e8f4ff] text-stone-400 flex items-center justify-center">4</div>
                  <span className="text-xs font-['Inter'] text-stone-500">Preview</span>
                </div>
              </div>
            </div>
            <header className="mb-16">
              <h1 className="font-['Public_Sans'] text-[3.5rem] leading-none font-extrabold tracking-tighter text-[#324670]">Basic Registration Form</h1>
              <div className="h-1 w-24 bg-[#9fcb54] mt-6"></div>
            </header>

            <section className="grid grid-cols-[1fr_2fr] gap-16">
              <div className="space-y-6">
                <div className="sticky top-24">
                  <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Initial Verification</h3>
                  <p className="text-[#324670] leading-relaxed text-sm">Please provide your primary contact information. Ensure all details match your official documents.</p>
                </div>
              </div>

              <div className="bg-[#e8f4ff] p-10 rounded-2xl shadow-sm border border-white/50">
                <form className="space-y-10" onSubmit={handleFormSubmit}>
                  {/* Fields in requested order */}
                  <div className="space-y-2">
                    <label className="font-medium text-sm flex items-center">Mobile No. (Username)<span className="text-[#c80000] ml-1">*</span></label>
                    <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors font-mono tracking-widest text-lg" maxLength={10} placeholder="10-DIGIT NUMERICAL" type="text" required />
                    <p className="text-[10px] text-[#324670] uppercase tracking-wider">Mandatory 10 digit numerical</p>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-sm flex items-center">Enter Candidate name as per matriculation certificate <span className="text-[#c80000] ml-1">*</span></label>
                    <input name="candidateName" value={formData.candidateName} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors uppercase" placeholder="ENTER FULL NAME" type="text" required />
                    <p className="text-[10px] text-[#324670] uppercase tracking-wider">As per Record in the Matriculation / Secondary Examination Certificate</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-medium text-sm flex items-center">Nationality <span className="text-[#c80000] ml-1">*</span></label>
                      <input name="nationality" value={formData.nationality} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors uppercase" placeholder="INDIAN" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium text-sm flex items-center">Gender <span className="text-[#c80000] ml-1">*</span></label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none appearance-none" required defaultValue="">
                        <option disabled value="">SELECT GENDER</option>
                        <option value="male">MALE</option>
                        <option value="female">FEMALE</option>
                        <option value="transgender">TRANSGENDER</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-sm flex items-center">To which category do you belong <span className="text-[#c80000] ml-1">*</span></label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none appearance-none" required defaultValue="">
                      <option disabled value="">SELECT CATEGORY</option>
                      <option value="general">GENERAL</option>
                      <option value="ews">EWS</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-[#32467033]">
                    <h3 className="text-[#324670] font-['Public_Sans'] font-bold text-xl mb-8">Personal Details ⇓</h3>
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <label className="font-medium text-sm flex items-center">Date of Birth <span className="text-[#c80000] ml-1">*</span></label>
                        <input name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <label className="font-medium text-sm flex items-center">Email <span className="text-[#c80000] ml-1">*</span></label>
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none" placeholder="active.email@domain.com" type="email" required />
                        <p className="text-[10px] text-[#324670] uppercase tracking-wider">Enter your current and Active E-mail Address</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#e8f4ff] rounded-xl border-l-4 border-[#9fcb54]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#324670] text-2xl flex-shrink-0">verified</span>
                      <div>
                        <p className="font-medium text-[#324670]">This site is protected by reCAPTCHA and the Google</p>
                        <p className="text-xs text-[#324670]"><a href="https://policies.google.com/privacy" className="hover:underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="hover:underline">Terms of Service</a> apply.</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-[#ffebee] border-l-4 border-[#c80000] rounded text-sm font-semibold text-[#c80000]">
                      {error}
                    </div>
                  )}

                  <div className="pt-6">
                    <button disabled={loading} className="w-full bg-[#324670] text-white py-5 px-8 rounded-lg font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#9fcb54] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed" type="submit">
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">hourglass_bottom</span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Email &amp; Register <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                      )}
                    </button>
                    <div className="text-center mt-6">
                      <p className="text-sm text-[#324670]">Already have an account? <Link to="/" className="font-semibold text-[#324670] hover:underline">Login here</Link></p>
                    </div>
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


