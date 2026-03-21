import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { getFullUrl } from '../config/apiConfig';

function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  // Get PDF URL from navigation state
  const pdfUrl = (location.state as any)?.pdfUrl;

  useEffect(() => {
    // If no PDF URL, redirect back
    if (!pdfUrl) {
      navigate('/preview');
    }
  }, [pdfUrl, navigate]);

  const handleDownloadPDF = async () => {
    if (!pdfUrl) return;

    setDownloading(true);
    setError('');

    try {
      const res = await fetch(getFullUrl(pdfUrl));
      
      if (!res.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'application.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // After download, redirect to profile
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download PDF. Please try again.');
      setDownloading(false);
    }
  };

  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">
      {/* Mobile View */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="text-center max-w-sm">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#fed488] to-[#ffd966] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="material-symbols-outlined text-5xl text-[#570013]" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-['Public_Sans'] font-black text-[#570013] mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-[#584141] leading-relaxed mb-8">
            Your application has been <strong>successfully submitted</strong>. A verification officer will review your records within <strong>48 business hours</strong>.
          </p>

          {/* Info Boxes */}
          <div className="space-y-4 mb-12">
            <div className="bg-[#fed488]/20 border border-[#fed488] rounded-lg p-4">
              <p className="text-sm text-[#775a19] font-semibold">
                <span className="material-symbols-outlined text-base align-middle mr-2">mail_outline</span>
                Check your email for the PDF and submission confirmation.
              </p>
            </div>
            <div className="bg-[#570013]/10 border border-[#570013] rounded-lg p-4">
              <p className="text-sm text-[#570013] font-semibold">
                <span className="material-symbols-outlined text-base align-middle mr-2">info</span>
                You can download your application PDF below.
              </p>
            </div>
          </div>

          {/* Download Button */}
          <div className="space-y-4">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full py-5 rounded-xl bg-[#570013] text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">
                {downloading ? 'hourglass_bottom' : 'download'}
              </span>
              {downloading ? 'DOWNLOADING...' : 'DOWNLOAD PDF'}
            </button>

            {error && (
              <div className="bg-[#ffebee] border border-[#ba1a1a] text-[#ba1a1a] p-4 rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-xl bg-[#ebe8e3] text-[#1c1c19] font-bold text-lg active:scale-95 transition-all"
            >
              Go to Profile
            </button>
          </div>
        </div>
        <Footer />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-screen px-8">
        <div className="text-center max-w-2xl">
          {/* Success Icon */}
          <div className="mb-12 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[#fed488] to-[#ffd966] rounded-full flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-7xl text-[#570013]" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-6xl font-['Public_Sans'] font-black text-[#570013] mb-6 tracking-tight">
            Application Submitted!
          </h1>
          <p className="text-xl text-[#584141] leading-relaxed mb-12 max-w-lg mx-auto">
            Your candidate record has been successfully submitted and is now in the institutional verification queue. A verification officer will review your application within <span className="font-bold">48 business hours</span>.
          </p>

          {/* Info Boxes */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div className="bg-[#fed488]/20 border-2 border-[#fed488] rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-[#775a19] flex-shrink-0">mail</span>
                <div>
                  <h3 className="font-bold text-[#775a19] mb-2 text-lg">Email Confirmation</h3>
                  <p className="text-sm text-[#775a19] opacity-90">Your application PDF and submission confirmation have been sent to your registered email address.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#570013]/10 border-2 border-[#570013] rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-[#570013] flex-shrink-0">download</span>
                <div>
                  <h3 className="font-bold text-[#570013] mb-2 text-lg">Download PDF</h3>
                  <p className="text-sm text-[#570013] opacity-90">Download your application PDF for your records. You can access it anytime from your profile.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#775a19]/10 border-2 border-[#775a19] rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-[#775a19] flex-shrink-0">schedule</span>
                <div>
                  <h3 className="font-bold text-[#775a19] mb-2 text-lg">Timeline</h3>
                  <p className="text-sm text-[#775a19] opacity-90">Review period: 48 business hours from submission date.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border-2 border-green-600 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-green-600 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <h3 className="font-bold text-green-800 mb-2 text-lg">Status</h3>
                  <p className="text-sm text-green-800 opacity-90">Your application is now under review. Check your profile for updates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-12 py-4 rounded-xl bg-[#570013] text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:bg-[#800020] transition-all"
            >
              <span className="material-symbols-outlined text-xl">
                {downloading ? 'hourglass_bottom' : 'download'}
              </span>
              {downloading ? 'DOWNLOADING...' : 'DOWNLOAD PDF'}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="px-12 py-4 rounded-xl bg-[#ebe8e3] text-[#1c1c19] font-bold text-lg hover:bg-[#dcdad5] transition-all"
            >
              Go to Profile
            </button>
          </div>

          {error && (
            <div className="mt-8 bg-[#ffebee] border-2 border-[#ba1a1a] text-[#ba1a1a] p-6 rounded-lg text-base font-semibold max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
