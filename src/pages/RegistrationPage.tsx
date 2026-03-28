import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import Footer from '../components/Footer';
import { useState } from 'react';
import { apiConfig } from '../config/apiConfig';

function RegistrationPage() {
  const navigate = useNavigate();
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
      // const token = await executeRecaptcha('register');
      const token = 'dummy_token'; // No longer required by backend

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

          {/* reCAPTCHA UI removed */}

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
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6 sticky top-20">
              <div className="space-y-2">
                <p className="text-[#9fcb54] font-semibold uppercase tracking-widest text-xs">Registration Portal</p>
                <h1 className="text-5xl font-['Public_Sans'] font-extrabold text-[#324670] leading-tight tracking-tighter">Candidate Registration</h1>
                <div className="h-1 w-20 bg-[#9fcb54] mt-4"></div>
              </div>
              <p className="text-[#324670] leading-relaxed text-sm">Create your UMTC registration account to access the application portal. Provide your basic information to get started.</p>
                {/* reCAPTCHA Info removed */}
            </div>
            <div className="lg:col-span-7 bg-white p-10 shadow-sm rounded-xl">
              <form className="space-y-8" onSubmit={handleFormSubmit}>
                {error && (
                  <div className="bg-[#c80000] text-white p-4 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#324670]">MOBILE NUMBER <span className="text-[#c80000]">*</span></label>
                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 uppercase font-bold text-[#324670] tracking-widest w-full bg-[#f0f8ff]"
                      placeholder="ENTER MOBILE NUMBER"
                      type="tel"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#324670]">CANDIDATE NAME <span className="text-[#c80000]">*</span></label>
                    <input
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 uppercase w-full bg-[#f0f8ff]"
                      placeholder="AS PER MATRICULATION CERTIFICATE"
                      type="text"
                      required
                    />
                    <p className="text-[10px] text-[#324670] uppercase tracking-wider">As per your official documents</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-['Inter'] text-sm font-medium text-[#324670]">NATIONALITY <span className="text-[#c80000]">*</span></label>
                      <input
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 uppercase w-full bg-[#f0f8ff]"
                        placeholder="INDIAN"
                        type="text"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-['Inter'] text-sm font-medium text-[#324670]">GENDER <span className="text-[#c80000]">*</span></label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 w-full bg-[#f0f8ff] appearance-none"
                        required
                        defaultValue=""
                      >
                        <option disabled value="">SELECT</option>
                        <option value="male">MALE</option>
                        <option value="female">FEMALE</option>
                        <option value="transgender">TRANSGENDER</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#324670]">CATEGORY <span className="text-[#c80000]">*</span></label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 w-full bg-[#f0f8ff] appearance-none"
                      required
                      defaultValue=""
                    >
                      <option disabled value="">SELECT CATEGORY</option>
                      <option value="general">GENERAL</option>
                      <option value="ews">EWS</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#324670]">DATE OF BIRTH <span className="text-[#c80000]">*</span></label>
                    <input
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 w-full bg-[#f0f8ff]"
                      type="date"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#324670]">EMAIL <span className="text-[#c80000]">*</span></label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 w-full bg-[#f0f8ff]"
                      placeholder="ACTIVE EMAIL ADDRESS"
                      type="email"
                      required
                    />
                    <p className="text-[10px] text-[#324670] uppercase tracking-wider">Enter your active email address</p>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-[#9fcb54] text-white py-4 font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {loading ? 'REGISTERING...' : 'REGISTER'} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </form>
              <div className="mt-8 text-center space-y-3">
                <p className="text-xs text-[#324670]">Already have an account? <Link className="text-[#324670] font-semibold underline underline-offset-4 hover:text-[#9fcb54]" to="/">Login here</Link></p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default RegistrationPage;


