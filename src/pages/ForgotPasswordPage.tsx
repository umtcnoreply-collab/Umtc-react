import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { apiConfig } from '../config/apiConfig';

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(apiConfig.auth.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      // Store email in localStorage for OTP page
      localStorage.setItem('email', email);
      localStorage.setItem('resetMode', 'true');

      // Show success message then redirect
      setSubmitted(true);
      setTimeout(() => {
        navigate('/otp');
      }, 2000);

    } catch (err) {
      setError('Server error. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f8ff] font-['Inter'] text-[#1c1c19] min-h-screen flex flex-col">
      {/* ══ MOBILE ══════════════════════════════════════════════ */}
      <div className="md:hidden flex-grow pt-24 pb-12 px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-10">
          <div className="space-y-2">
            <h1 className="font-['Public_Sans'] text-[2rem] font-extrabold text-[#324670] tracking-tight leading-none">Reset Password</h1>
            <div className="w-12 h-1 bg-[#EC5A3B]"></div>
            <p className="text-[#324670] text-sm mt-4 font-medium italic">Enter your email to receive an OTP for password reset.</p>
          </div>
          <section className="bg-[#f0f8ff] p-8 rounded-xl space-y-8">
            {error && (
              <div className="bg-[#c80000] text-white p-4 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            {submitted && (
              <div className="bg-green-600 text-white p-4 rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                OTP sent successfully! Redirecting...
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="font-['Inter'] text-xs font-semibold text-[#324670] tracking-wider uppercase flex items-center">
                  Email Address <span className="text-[#c80000] ml-1">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-[#e5e2dd] border-b-2 border-[#324670] px-4 py-3 transition-all focus:border-[#324670] focus:outline-none focus:bg-white uppercase"
                  placeholder="ENTER YOUR REGISTERED EMAIL"
                  type="email"
                  required
                  disabled={submitted}
                />
              </div>
              <button 
                disabled={loading || submitted}
                className="w-full bg-[#324670] text-white py-5 rounded-lg font-['Public_Sans'] font-bold text-sm tracking-widest shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? 'SENDING OTP...' : 'SEND OTP'}
              </button>
            </form>
            <div className="flex justify-center pt-2">
              <Link to="/login" className="text-xs font-bold text-[#0172b9] border-b border-[#EC5A3B] hover:text-[#324670] transition-colors">
                BACK TO LOGIN
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
                <p className="text-[#EC5A3B] font-semibold uppercase tracking-widest text-xs">Password Recovery</p>
                <h1 className="text-5xl font-['Public_Sans'] font-extrabold text-[#324670] leading-tight tracking-tighter">Reset Password</h1>
                <div className="h-1 w-20 bg-[#EC5A3B] mt-4"></div>
              </div>
              <p className="text-[#324670] leading-relaxed text-sm">Enter your registered email address and we'll send you an OTP to reset your password securely.</p>
              <div className="p-6 bg-[#f0f8ff] rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#EC5A3B]">mail_lock</span>
                  <div>
                    <p className="font-medium text-sm">Secure Recovery</p>
                    <p className="text-xs text-[#324670]">OTP-based authentication for your security.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 bg-white p-10 shadow-sm rounded-xl">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-[#c80000] text-white p-4 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}
                {submitted && (
                  <div className="bg-green-600 text-white p-4 rounded-lg text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    OTP sent successfully! Redirecting...
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#324670]">EMAIL ADDRESS <span className="text-[#c80000]">*</span></label>
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className="border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors py-3 px-4 lowercase w-full bg-[#e8f4ff]"
                      placeholder="ENTER YOUR REGISTERED EMAIL"
                      type="email"
                      required
                      disabled={submitted}
                    />
                  </div>
                  <button
                    disabled={loading || submitted}
                    className="w-full bg-[#800020] text-white py-4 font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {loading ? 'SENDING OTP...' : 'SEND OTP'} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </form>
              <div className="mt-8 text-center space-y-3">
                <p className="text-xs text-[#324670]"><Link className="text-[#324670] font-semibold underline underline-offset-4 hover:text-[#EC5A3B]" to="/login">Back to Login</Link></p>
                <p className="text-xs text-[#324670]">Don't have an account? <Link className="text-[#324670] font-semibold underline underline-offset-4 hover:text-[#EC5A3B]" to="/registration">Register as New Candidate</Link></p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

