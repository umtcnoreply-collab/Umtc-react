import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { loginSuccess } from '../store/authSlice';
import { apiConfig } from '../config/apiConfig';


function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const plinth = "w-full bg-[#e5e2dd] border-b-2 border-[#8c7071] px-4 py-3 transition-all focus:border-[#570013] focus:outline-none focus:bg-white uppercase";

  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(apiConfig.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Check if user is verified
      if (!data.isVerified) {
        localStorage.setItem('email', data.email);
        navigate('/otp');
        return;
      }

      // Store token and mobile in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('mobile', formData.mobile);
      localStorage.setItem('currentStep', data.currentStep);

      // Dispatch Redux action to update auth state
      dispatch(loginSuccess({
        token: data.token,
        mobile: formData.mobile,
        currentStep: data.currentStep
      }));

      // Navigate based on currentStep
      if (data.currentStep === 1) {
        navigate('/basic-details');
      } else if (data.currentStep === 2) {
        navigate('/documents');
      } else if (data.currentStep === 3) {
        navigate('/preview');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError('Server error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            {error && (
              <div className="bg-[#ba1a1a] text-white p-4 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="font-['Inter'] text-xs font-semibold text-[#584141] tracking-wider uppercase flex items-center">
                  Mobile Number <span className="text-[#ba1a1a] ml-1">*</span>
                </label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={plinth}
                  placeholder="ENTER REGISTERED MOBILE"
                  type="tel"
                  maxLength={10}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-['Inter'] text-xs font-semibold text-[#584141] tracking-wider uppercase flex items-center">
                  Password <span className="text-[#ba1a1a] ml-1">*</span>
                </label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={plinth}
                  placeholder="ENTER YOUR PASSWORD"
                  type="password"
                  required
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-[#570013] text-white py-5 rounded-lg font-['Public_Sans'] font-bold text-sm tracking-widest shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>
            <div className="flex justify-center items-center gap-4 pt-2">
              <Link to="/registration" className="text-xs font-bold text-[#8e0f28] border-b border-[#775a19] hover:text-[#570013] transition-colors">
                BACK TO REGISTRATION
              </Link>
              <span className="text-[#8c7071]">•</span>
              <Link to="/forgot-password" className="text-xs font-bold text-[#8e0f28] border-b border-[#775a19] hover:text-[#570013] transition-colors">
                FORGOT PASSWORD?
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
              <form className="space-y-8" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-[#ba1a1a] text-white p-4 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#584141]">MOBILE NUMBER <span className="text-[#ba1a1a]">*</span></label>
                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors py-3 px-4 uppercase font-bold text-[#570013] tracking-widest w-full bg-[#ebe8e3]"
                      placeholder="ENTER 10 DIGIT NUMBER"
                      type="tel"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-sm font-medium text-[#584141]">PASSWORD <span className="text-[#ba1a1a]">*</span></label>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors py-3 px-4 w-full bg-[#ebe8e3]"
                      placeholder="ENTER YOUR PASSWORD"
                      type="password"
                      required
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-[#800020] text-white py-4 font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {loading ? 'LOGGING IN...' : 'LOGIN'} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </form>
              <div className="mt-8 text-center space-y-3">
                <p className="text-xs text-[#584141]">Don't have an account? <Link className="text-[#570013] font-semibold underline underline-offset-4 hover:text-[#775a19]" to="/registration">Register as New Candidate</Link></p>
                <p className="text-xs text-[#584141]"><Link className="text-[#8e0f28] font-semibold underline underline-offset-4 hover:text-[#570013]" to="/forgot-password">Forgot Password?</Link></p>
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
