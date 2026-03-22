import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useState, useRef, useEffect } from 'react';
import { apiConfig } from '../config/apiConfig';

function OTPPage() {
  const navigate = useNavigate();

  const email = localStorage.getItem('email');
  const resetMode = localStorage.getItem('resetMode') === 'true';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const maskEmail = (email: string | null) => {
  if (!email) return '';

  const [name, domain] = email.split('@');

  if (name.length <= 2) return `${name[0]}***@${domain}`;

  return `${name.slice(0, 2)}***@${domain}`;
};

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCounter, setResendCounter] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCounter > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendCounter(resendCounter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCounter === 0) {
      setCanResend(true);
    }
  }, [resendCounter, canResend]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numeric values
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Limit to single digit
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-move to next input if digit entered
    if (digit && index < 5) {
      // Use a longer timeout for mobile devices to ensure virtual keyboard dismissal
      const delay = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 100 : 0;
      setTimeout(() => {
        const nextInput = otpRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          nextInput.select?.();
        }
      }, delay);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.preventDefault();
      const delay = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 50 : 0;
      setTimeout(() => {
        const prevInput = otpRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          prevInput.select?.();
        }
      }, delay);
    }
    
    // Move to next input on arrow right
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      const nextInput = otpRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Move to previous input on arrow left
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = otpRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };


  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');

    console.log(otpValue)

    if (otpValue.length !== 6) {
      alert('Enter complete OTP');
      return;
    }

    try {
      const res = await fetch(apiConfig.auth.verifyOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setIsVerified(true);

    } catch (err) {
      console.error(err);
      alert('Error verifying OTP');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSetPassword = async () => {
    const { password, confirmPassword } = passwordData;

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const otpString = otp.join('');
      const endpoint = resetMode ? apiConfig.auth.resetPassword : apiConfig.auth.setPassword;
      const payload = resetMode 
        ? { email, otp: otpString, newPassword: password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log(data);
      console.log(data);

      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (!resetMode) {
        // save token only for registration flow
        localStorage.setItem('token', data.token);
        navigate('/basic-details');
      } else {
        // Clear reset mode flag and redirect to login
        localStorage.removeItem('resetMode');
        localStorage.removeItem('email');
        navigate('/login');
      }

    } catch (err) {
      console.error(err);
      alert('Error setting password');
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage('');

    try {
      const endpoint = resetMode ? apiConfig.auth.forgotPassword : apiConfig.auth.resendOtp;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setResendMessage(data.message || 'Failed to resend OTP');
        setResendLoading(false);
        return;
      }

      // Reset OTP and countdown
      setOtp(['', '', '', '', '', '']);
      setResendCounter(60);
      setCanResend(false);
      setResendMessage('OTP sent successfully! Check your email.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setResendMessage('');
      }, 3000);

      // Focus on first OTP input
      otpRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
      setResendMessage('Error resending OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f8ff] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">
      {/* ══ MOBILE ══════════════════════════════════════════════ */}
      <div className="md:hidden pt-24 pb-32 px-6 min-h-screen flex flex-col max-w-md mx-auto w-full">
        {!isVerified && (
          <>
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-[#fed488] text-[#9fcb54] font-['Inter'] text-[10px] uppercase tracking-widest rounded-full mb-4">
            {resetMode ? 'Password Recovery' : 'Identity Verification'}
          </div>
          <h1 className="font-['Public_Sans'] font-extrabold text-3xl text-[#324670] leading-tight tracking-tight mb-4">
            {resetMode ? 'Reset Your Password' : 'Verify Your Sovereignty'}
          </h1>
          <p className="text-[#324670] leading-relaxed text-sm">
            {resetMode 
              ? 'Enter the 6-digit code sent to your registered email address to reset your password.'
              : 'A unique 6-digit code has been dispatched to your registered email address.'}
          </p>
        </header>
        <section className="bg-[#f0f8ff] p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#324670]"></div>
          <div className="flex flex-col gap-8">
            <div>
              <label className="block font-['Public_Sans'] font-bold text-sm text-[#324670] uppercase tracking-widest mb-6">Enter Security Code</label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    maxLength={1}
                    className={`w-full h-16 text-center text-2xl font-bold 
    ${isVerified ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#e8f4ff]'} 
    border-b-2 border-[#324670] focus:border-[#324670] focus:outline-none transition-colors`}
                    inputMode="numeric"
                    type="tel"
                    disabled={isVerified}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={handleVerifyOtp} className="w-full bg-[#324670] hover:bg-[#9fcb54] text-white py-4 px-6 rounded-xl font-['Public_Sans'] font-bold text-sm tracking-wide shadow-sm active:scale-[0.98] transition-all">
                {resetMode ? 'Submit OTP & Reset Password' : 'Submit OTP & Finalize Registration'}
              </button>
              <button 
                onClick={handleResendOtp}
                disabled={!canResend || resendLoading}
                className={`w-full py-4 px-6 rounded-xl font-['Public_Sans'] font-bold text-sm tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2
                  ${!canResend || resendLoading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#e5e2dd] text-[#1c1c19] hover:bg-[#dbd8d3]'}`}
              >
                <span className="material-symbols-outlined text-sm">{resendLoading ? 'hourglass_empty' : 'refresh'}</span> 
                {resendLoading ? 'Sending...' : canResend ? 'Resend OTP' : `Resend in ${resendCounter}s`}
              </button>
              {resendMessage && (
                <p className={`text-center text-sm font-medium py-2 px-4 rounded-lg
                  ${resendMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {resendMessage}
                </p>
              )}
            </div>
          </div>
        </section>
          </>
        )}
        {isVerified && (
          <div className="mt-8 space-y-6 p-6 bg-[#e8f4ff] rounded-xl border border-[#e5e2dd]">
            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#324670] mb-6">
              {resetMode ? 'Set New Password' : 'Create Your Password'}
            </h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Password <span className="text-[#c80000]">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter a strong password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#e8f4ff] p-3 pr-10 border-b-2 border-[#324670] focus:border-[#324670] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#324670] hover:text-[#324670] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-[#324670] uppercase tracking-wider">Minimum 6 characters recommended</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1c1c19]">Confirm Password <span className="text-[#c80000]">*</span></label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#e8f4ff] p-3 pr-10 border-b-2 border-[#324670] focus:border-[#324670] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#324670] hover:text-[#324670] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {passwordData.password && passwordData.confirmPassword && passwordData.password === passwordData.confirmPassword && (
                <p className="text-[10px] text-green-700 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Passwords match</p>
              )}
              {passwordData.password && passwordData.confirmPassword && passwordData.password !== passwordData.confirmPassword && (
                <p className="text-[10px] text-[#c80000] font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> Passwords don't match</p>
              )}
            </div>

            <button
              onClick={handleSetPassword}
              className="w-full bg-[#324670] hover:bg-[#9fcb54] text-white py-4 px-6 rounded-xl font-['Public_Sans'] font-bold text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              Set Password & Continue
            </button>
          </div>
        )}
        <section className="mt-8 flex gap-4 items-start p-4 bg-white/50 rounded-lg">
          <span className="material-symbols-outlined text-[#9fcb54]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <div>
            <h4 className="font-['Public_Sans'] font-bold text-xs text-[#324670] uppercase tracking-tighter">Encrypted Handshake</h4>
            <p className="text-[11px] text-[#324670] leading-normal mt-1">Session protected by 256-bit institutional-grade encryption.</p>
          </div>
        </section>
        <Footer />
      </div>

      {/* ══ DESKTOP ═════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <main className="flex-grow flex items-center justify-center px-4 py-12 bg-stone-100">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-0 bg-white overflow-hidden shadow-2xl rounded-xl">
            <div className="md:col-span-5 bg-[#9fcb54] p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="z-10">
                <span className="text-[#fed488] font-['Public_Sans'] font-bold tracking-widest uppercase text-xs">
                  {resetMode ? 'Password Recovery' : 'Security Protocol'}
                </span>
                <h1 className="font-['Public_Sans'] text-4xl font-extrabold mt-4 mb-6 leading-tight">
                  {resetMode ? 'Reset Password' : 'Identity Verification'}
                </h1>
                <p className="text-[#ff828a] text-lg leading-relaxed opacity-90">
                  {resetMode 
                    ? 'Verify your identity to reset your password securely.'
                    : 'Security code dispatched to your registered email.'}
                </p>
              </div>
            </div>
            <div className="md:col-span-7 p-10 md:p-16 flex flex-col justify-center bg-[#f0f8ff]">
              {!isVerified && (
                <>
              <div className="mb-10">
                <h2 className="font-['Public_Sans'] text-2xl font-bold text-[#324670] mb-2">
                  {resetMode ? 'Verify Your Identity' : 'Enter Verification Code'}
                </h2>
                <p className="text-[#324670]">
                  {resetMode 
                    ? 'Enter the code sent to'
                    : 'A 6-digit code was sent to'} <span className="font-semibold text-[#1c1c19]"> {maskEmail(localStorage.getItem('email'))}</span>
                </p>
              </div>
              <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="flex justify-between gap-2 md:gap-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      maxLength={1}
                      className={`w-full h-16 text-center text-2xl font-bold 
    ${isVerified ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#e8f4ff]'} 
    border-b-2 border-[#324670] focus:border-[#324670] focus:outline-none transition-colors`}
                      inputMode="numeric"
                      type="tel"
                      disabled={isVerified}
                    />
                  ))}
                </div>
                <button onClick={handleVerifyOtp}   className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all
    ${isVerified 
      ? 'hidden' 
      : 'bg-[#324670] hover:bg-[#9fcb54] text-white'}`} type="submit">
                  {resetMode ? 'Submit OTP & Reset Password' : 'Submit OTP & Finalize Registration'}
                </button>
                {!isVerified && (
                  <div className="space-y-3 ">
                    <button 
                      onClick={handleResendOtp}
                      disabled={!canResend || resendLoading}
                      type="button"
                      className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                        ${!canResend || resendLoading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#e5e2dd] text-[#1c1c19] hover:bg-[#dbd8d3]'}`}
                    >
                      <span className="material-symbols-outlined text-sm">{resendLoading ? 'hourglass_empty' : 'refresh'}</span> 
                      {resendLoading ? 'Sending...' : canResend ? 'Resend OTP' : `Resend in ${resendCounter}s`}
                    </button>
                    {resendMessage && (
                      <p className={`text-center text-sm font-medium py-2 px-4 rounded-lg
                        ${resendMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {resendMessage}
                      </p>
                    )}
                  </div>
                )}
              </form>
              </>
              )}
              {isVerified && (
          <div className="space-y-8 p-10 bg-white">
            <div>
              <h2 className="font-['Public_Sans'] text-2xl font-bold text-[#324670] mb-2">
                {resetMode ? 'Set New Password' : 'Create Your Password'}
              </h2>
              <p className="text-[#324670] text-sm">
                {resetMode 
                  ? 'Enter a new secure password for your account'
                  : 'Set a secure password to protect your account'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-medium text-sm flex items-center">Password <span className="text-[#c80000] ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter a strong password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    className="w-full bg-[#e8f4ff] p-4 pr-12 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#324670] hover:text-[#324670] transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-[10px] text-[#324670] uppercase tracking-wider">Minimum 6 characters recommended</p>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-sm flex items-center">Confirm Password <span className="text-[#c80000] ml-1">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-[#e8f4ff] p-4 pr-12 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#324670] hover:text-[#324670] transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {passwordData.password && passwordData.confirmPassword && passwordData.password === passwordData.confirmPassword && (
                  <p className="text-[10px] text-green-700 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Passwords match</p>
                )}
                {passwordData.password && passwordData.confirmPassword && passwordData.password !== passwordData.confirmPassword && (
                  <p className="text-[10px] text-[#c80000] font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> Passwords don't match</p>
                )}
              </div>
            </div>

            <button
              onClick={handleSetPassword}
              className="w-full bg-[#324670] hover:bg-[#9fcb54] text-white py-5 px-8 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">lock</span>
              Set Password & Continue
            </button>
          </div>
        )}
            </div>
            
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default OTPPage



