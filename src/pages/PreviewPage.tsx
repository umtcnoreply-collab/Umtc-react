import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';
import { useAuth } from '../store/useAuth';
import { apiConfig, getFullUrl } from '../config/apiConfig';

function PreviewPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  // Handle application submission
  const handleSubmitApplication = async () => {
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const res = await fetch(apiConfig.application.submitApplication, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      console.log('Submission Response:',  data);

      if (!res.ok) {
        setSubmitError(data.message || 'Failed to submit application');
        setSubmitting(false);
        return;
      }

      console.log('Application submitted successfully:', data);
      
      // Navigate to thank you page with PDF URL
      navigate('/thank-you', { state: { pdfUrl: data.pdfUrl } });
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while submitting');
      setSubmitting(false);
    }
  };

  // Fetch application data from API
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(apiConfig.application.getApplication, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch application data: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Fetched Application Data:', data);
        
        // Check if application is already submitted
        if (data.applicationStatus === 'Submitted' || data.applicationStatus === 'Approved' || data.applicationStatus === 'Rejected') {
          console.log('Application already submitted, redirecting to profile');
          navigate('/profile', { replace: true });
          return;
        }
        
        setFormData(data);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching application data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplicationData();
    }
  }, [token, navigate]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
    } catch {
      return dateString;
    }
  };

  // Format boolean values
  const formatBool = (value: any) => value ? 'Yes' : 'No';

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="material-symbols-outlined text-5xl text-[#570013] animate-spin">hourglass_bottom</span>
          </div>
          <p className="text-lg font-semibold text-[#570013]">Loading your application...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !formData) {
    return (
      <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-5xl text-[#ba1a1a] mb-4 inline-block">error</span>
          <p className="text-lg font-semibold text-[#ba1a1a] mb-2">Unable to Load Application</p>
          <p className="text-sm text-[#584141] mb-6">{error || 'Unable to fetch your application data. Please try again.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-[#570013] text-white rounded-lg font-semibold hover:bg-[#800020] transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">
      
      {/* ══ MOBILE VIEW ══════════════════════════════════════════════ */}
      <div className="md:hidden flex-grow pt-24 pb-32 px-6 max-w-md mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-[2.5rem] leading-tight font-['Public_Sans'] font-black text-[#570013] tracking-tight mb-2">Final Review</h1>
          <div className="h-1 w-12 bg-[#775a19] rounded-full mb-4"></div>
          <p className="text-[#584141] text-sm leading-relaxed">
            Please verify all provided information. Once submitted, your records will enter the institutional verification queue.
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-[#fed488]/30 border-l-4 border-[#775a19] flex items-start gap-4 rounded-r-xl">
          <span className="material-symbols-outlined text-[#775a19] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <div>
            <p className="text-sm font-bold text-[#785a1a]">Ready for submission</p>
            <p className="text-xs text-[#785a1a]/80 mt-1">All mandatory fields have been validated.</p>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* 1. Registration Details */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Registration Info</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-6 space-y-4 shadow-sm border border-[#e5e2dd]">
              <div className="grid grid-cols-1 gap-1">
                <label className="text-[10px] font-bold text-[#584141] uppercase tracking-wider">Candidate Name</label>
                <p className="text-[#1c1c19] font-medium">{formData?.candidateName || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Mobile Number</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.mobile || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Email Address</label><p className="text-[#1c1c19] font-medium text-sm break-all">{formData?.email || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Date of Birth</label><p className="text-[#1c1c19] font-medium text-sm">{formatDate(formData?.dob) || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Gender</label><p className="text-[#1c1c19] font-medium text-sm capitalize">{formData?.gender || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Nationality</label><p className="text-[#1c1c19] font-medium text-sm capitalize">{formData?.nationality || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Category</label><p className="text-[#1c1c19] font-medium text-sm uppercase">{formData?.category || 'N/A'}</p></div>
              </div>
            </div>
          </section>

          {/* 2. Basic Details & Address */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Basic Details</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-6 space-y-4 shadow-sm border border-[#e5e2dd]">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Mother Name</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.basicDetails?.motherName || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Father Name</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.basicDetails?.fatherName || 'N/A'}</p></div>
              </div>
              
              <div className="pt-2 border-t border-[#e5e2dd]">
                <label className="text-[10px] font-bold text-[#584141] uppercase">Permanent Address</label>
                <p className="text-[#1c1c19] font-medium text-sm">{formData?.address?.permanentAddress?.address || 'N/A'}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div><label className="text-[10px] font-bold text-[#584141] uppercase">State</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.address?.permanentAddress?.state || 'N/A'}</p></div>
                  <div><label className="text-[10px] font-bold text-[#584141] uppercase">Pin Code</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.address?.permanentAddress?.pincode || 'N/A'}</p></div>
                  <div><label className="text-[10px] font-bold text-[#584141] uppercase">City</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.address?.permanentAddress?.city || 'N/A'}</p></div>
                  <div><label className="text-[10px] font-bold text-[#584141] uppercase">District</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.address?.permanentAddress?.district || 'N/A'}</p></div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e5e2dd] grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Debarred?</label><p className="text-[#1c1c19] font-medium text-sm">{formatBool(formData?.basicDetails?.debarred)}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">FIR Cases?</label><p className="text-[#1c1c19] font-medium text-sm">{formatBool(formData?.basicDetails?.fir)}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Govt Employee?</label><p className="text-[#1c1c19] font-medium text-sm">{formatBool(formData?.basicDetails?.govt_emp)}</p></div>
              </div>
            </div>
          </section>

          {/* 3. Documentation */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Uploaded Documents</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-4 space-y-4 shadow-sm border border-[#e5e2dd]">
              {/* Photo & Signature Images */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {formData?.documents?.photoUrl && (
                  <div className="flex flex-col items-center justify-center p-3 bg-[#fcf9f4] rounded-lg border border-[#e5e2dd]">
                    <img src={getFullUrl(formData.documents.photoUrl)} alt="Photograph" className="w-20 h-28 object-cover rounded mb-2 border border-[#e5e2dd]" />
                    <span className="text-xs font-medium text-[#584141] mb-1">Photograph</span>
                    <span className="material-symbols-outlined text-[#775a19] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                )}
                {formData?.documents?.signatureUrl && (
                  <div className="flex flex-col items-center justify-center p-3 bg-[#fcf9f4] rounded-lg border border-[#e5e2dd]">
                    <img src={getFullUrl(formData.documents.signatureUrl)} alt="Signature" className="w-20 h-16 object-contain rounded mb-2 border border-[#e5e2dd]" />
                    <span className="text-xs font-medium text-[#584141] mb-1">Signature</span>
                    <span className="material-symbols-outlined text-[#775a19] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                )}
              </div>
              {/* Qualification Documents */}
              <div className="border-t border-[#e5e2dd] pt-4">
                <label className="text-[10px] font-bold text-[#584141] uppercase mb-3 block">Educational Qualifications</label>
                <div className="space-y-2">
                  {['tenth', 'twelfth', 'grad', 'other'].map((level: string) => formData?.qualifications?.[level]?.fileUrl && (
                    <div key={level} className="flex items-center justify-between p-3 bg-[#fcf9f4] rounded-lg border border-[#e5e2dd]">
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <span className="material-symbols-outlined text-[#775a19] text-sm shrink-0">file_present</span>
                        <span className="text-xs font-medium truncate">{level === 'tenth' ? '10th' : level === 'twelfth' ? '12th' : level === 'grad' ? 'Graduation' : 'Other'} Document</span>
                      </div>
                      <span className="material-symbols-outlined text-[#775a19] text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Identification & Status */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Identification & Status</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-6 space-y-4 shadow-sm border border-[#e5e2dd]">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Aadhar Number</label><p className="text-[#1c1c19] font-medium text-sm">{formData?.basicDetails?.aadhar || 'N/A'}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Ex-ServiceMen?</label><p className="text-[#1c1c19] font-medium text-sm">{formatBool(formData?.basicDetails?.exServicemen)}</p></div>
              </div>
              <div className="pt-2 border-t border-[#e5e2dd]">
                <label className="text-[10px] font-bold text-[#584141] uppercase mb-3 block">Visible Identification Marks</label>
                <div className="space-y-2">
                  {formData?.basicDetails?.visibleMarks && formData.basicDetails.visibleMarks.length > 0 ? (
                    formData.basicDetails.visibleMarks.map((mark: string, index: number) => (
                      <p key={index} className="text-sm font-medium text-[#584141] p-2 bg-[#fcf9f4] rounded border border-[#e5e2dd]">{mark || 'N/A'}</p>
                    ))
                  ) : (
                    <p className="text-sm font-medium">N/A</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 5. Declarations & Rules */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Application Declarations</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-6 space-y-6 shadow-sm border border-[#e5e2dd] text-sm text-[#584141]">
              <div className="space-y-2">
                <h3 className="font-bold text-[#570013]">Submission Acknowledgment</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Final Preview:</strong> I verify that all data above is correct before submission.</li>
                  <li><strong>PDF Generation:</strong> A completed application PDF will be generated upon submission.</li>
                  <li><strong>Unique ID:</strong> I confirm this mobile number and email ID are uniquely registered to me.</li>
                  <li><strong>Email Notifications:</strong> A system-generated PDF and acknowledgment will be emailed to my registered address post-submission.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-12 space-y-4">
          <button onClick={() => setShowModal(true)} className="w-full py-4 bg-[#570013] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
            Submit Final Application <span className="material-symbols-outlined text-sm">send</span>
          </button>
          <button onClick={() => navigate("/basic-details")} className="w-full py-4 bg-[#e5e2dd] text-[#1c1c19] font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
            Edit Application <span className="material-symbols-outlined text-sm">edit_note</span>
          </button>
        </div>
        <Footer />
      </div>

      {/* ══ DESKTOP VIEW ═════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <div className="flex-grow flex w-full max-w-7xl mx-auto px-8 py-12">
          <SideNavBar activePath="/preview" />
          <main className="flex-1 bg-[#fcf9f4] pl-8 pb-12 relative">
            
            <div className="mb-16">
              <div className="flex items-center justify-between relative">
                {/* Background line - unfilled */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#ebe8e3] -z-10"></div>
                {/* Filled progress line */}
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-[#775a19] -z-10 transition-all duration-500"
                  style={{ width: `${(formData?.currentStep || 1) * 33.33}%` }}
                ></div>
                
                {/* Step 1: Registration */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#775a19] text-white flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Registration</span>
                </div>
                
                {/* Step 2: Basic Details */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold shadow-md ${(formData?.currentStep || 1) >= 2 ? 'bg-[#775a19]' : 'bg-[#ebe8e3] text-[#584141]'}`}>
                    {(formData?.currentStep || 1) >= 2 ? <span className="material-symbols-outlined text-sm">check</span> : '2'}
                  </div>
                  <span className="text-xs font-['Inter'] text-stone-500">Basic Details</span>
                </div>
                
                {/* Step 3: Documents */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold shadow-md ${(formData?.currentStep || 1) >= 3 ? 'bg-[#775a19]' : 'bg-[#ebe8e3] text-[#584141]'}`}>
                    {(formData?.currentStep || 1) >= 3 ? <span className="material-symbols-outlined text-sm">check</span> : '3'}
                  </div>
                  <span className="text-xs font-['Inter'] text-stone-500">Documents</span>
                </div>
                
                {/* Step 4: Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-md ${(formData?.currentStep || 1) >= 4 ? 'bg-[#570013]' : 'bg-[#ebe8e3] text-[#584141]'}`}>
                    4
                  </div>
                  <span className={`text-sm font-['Inter'] font-semibold ${(formData?.currentStep || 1) >= 4 ? 'text-[#570013]' : 'text-stone-500'}`}>Preview</span>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h1 className="text-5xl font-['Public_Sans'] font-extrabold text-[#570013] mb-2 tracking-tight">Review Your Application</h1>
              <p className="text-[#584141] max-w-2xl leading-relaxed">Please verify all information before final submission. Changes cannot be made after this point.</p>
              <div className="w-24 h-1 bg-[#775a19] mt-4"></div>
            </div>

            <div className="space-y-12">
              
              {/* Registration Grid */}
              <section className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 relative">
                {/* 📌 ADDED STICKY CLASSES HERE */}
                <div className="sticky top-8 self-start">
                  <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013]">Identity & Heritage</h3>
                  <p className="text-sm text-[#584141] mt-2">Primary candidate identifiers and contact information.</p>
                </div>
                <div className="bg-[#f6f3ee] p-8 rounded-xl border border-[#ebe8e3]">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="col-span-2"><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Candidate Name</label><p className="text-lg font-medium">{formData?.candidateName || 'N/A'}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Mobile Number</label><p className="text-base font-medium">{formData?.mobile || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Email Address</label><p className="text-base font-medium">{formData?.email || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Date of Birth</label><p className="text-base font-medium">{formatDate(formData?.dob) || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Gender</label><p className="text-base font-medium capitalize">{formData?.gender || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Nationality</label><p className="text-base font-medium capitalize">{formData?.nationality || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Category</label><p className="text-base font-medium uppercase">{formData?.category || 'N/A'}</p></div>
                  </div>
                </div>
              </section>

              {/* Basic Details & Address Grid */}
              <section className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 relative">
                {/* 📌 ADDED STICKY CLASSES HERE */}
                <div className="sticky top-8 self-start">
                  <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013]">Basic Details & Address</h3>
                  <p className="text-sm text-[#584141] mt-2">Family background, location, and legal declarations.</p>
                </div>
                <div className="bg-[#f6f3ee] p-8 rounded-xl border border-[#ebe8e3] space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Mother Name</label><p className="text-base font-medium">{formData?.basicDetails?.motherName || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Father Name</label><p className="text-base font-medium">{formData?.basicDetails?.fatherName || 'N/A'}</p></div>
                  </div>
                  
                  <div className="pt-6 border-t border-[#ebe8e3]">
                    <label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Permanent Address</label>
                    <p className="text-base font-medium">{formData?.address?.permanentAddress?.address || 'N/A'}</p>
                    <div className="grid grid-cols-2 gap-8 mt-4">
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">City</label><p className="text-base font-medium">{formData?.address?.permanentAddress?.city || 'N/A'}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">State</label><p className="text-base font-medium">{formData?.address?.permanentAddress?.state || 'N/A'}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">District</label><p className="text-base font-medium">{formData?.address?.permanentAddress?.district || 'N/A'}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Pin Code</label><p className="text-base font-medium">{formData?.address?.permanentAddress?.pincode || 'N/A'}</p></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#ebe8e3]">
                    <label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Correspondence Address</label>
                    <p className="text-base font-medium">{formData?.address?.correspondenceAddress?.address || 'N/A'}</p>
                    <div className="grid grid-cols-2 gap-8 mt-4">
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">City</label><p className="text-base font-medium">{formData?.address?.correspondenceAddress?.city || 'N/A'}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">State</label><p className="text-base font-medium">{formData?.address?.correspondenceAddress?.state || 'N/A'}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">District</label><p className="text-base font-medium">{formData?.address?.correspondenceAddress?.district || 'N/A'}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Pin Code</label><p className="text-base font-medium">{formData?.address?.correspondenceAddress?.pincode || 'N/A'}</p></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#ebe8e3] grid grid-cols-3 gap-6">
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Debarred?</label><p className="text-base font-medium">{formatBool(formData?.basicDetails?.debarred)}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">FIR Against?</label><p className="text-base font-medium">{formatBool(formData?.basicDetails?.fir)}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Govt Employee?</label><p className="text-base font-medium">{formatBool(formData?.basicDetails?.govt_emp)}</p></div>
                  </div>
                </div>
              </section>

              {/* Documents Grid */}
              <section className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 relative">
                {/* 📌 ADDED STICKY CLASSES HERE */}
                <div className="sticky top-8 self-start">
                  <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013]">Uploaded Documents</h3>
                  <p className="text-sm text-[#584141] mt-2">Media assets and academic credentials.</p>
                </div>
                <div className="bg-[#f6f3ee] p-8 rounded-xl border border-[#ebe8e3]">
                   <div className="mb-8">
                     <label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold mb-4">Recent Photograph & Signature</label>
                     <div className="grid grid-cols-2 gap-4">
                       {formData?.documents?.photoUrl && (
                         <div className="flex flex-col items-center justify-center p-6 bg-[#fcf9f4] rounded-lg border border-[#ebe8e3]">
                           <img src={getFullUrl(formData.documents.photoUrl)} alt="Photograph" className="w-32 h-40 object-cover rounded mb-3 border border-[#e5e2dd]" />
                           <span className="text-xs font-medium text-[#584141]">Photograph</span>
                           <span className="material-symbols-outlined text-green-700 text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                         </div>
                       )}
                       {formData?.documents?.signatureUrl && (
                         <div className="flex flex-col items-center justify-center p-6 bg-[#fcf9f4] rounded-lg border border-[#ebe8e3]">
                           <img src={getFullUrl(formData.documents.signatureUrl)} alt="Signature" className="w-32 h-20 object-contain rounded mb-3 border border-[#e5e2dd]" />
                           <span className="text-xs font-medium text-[#584141]">Digital Signature</span>
                           <span className="material-symbols-outlined text-green-700 text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                         </div>
                       )}
                     </div>
                   </div>
                   <div className="pt-6 border-t border-[#ebe8e3]">
                     <label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold mb-4">Educational Qualifications</label>
                     {formData?.qualifications && (
                       <div className="space-y-4">
                         {Object.entries(formData.qualifications).map(([level, data]: [string, any]) => (
                           data?.fileUrl && (
                             <div key={level} className="p-4 bg-[#fcf9f4] rounded-lg border border-[#ebe8e3]">
                               <p className="text-sm font-medium capitalize mb-2">{level === 'tenth' ? '10th' : level === 'twelfth' ? '12th' : level === 'grad' ? 'Graduation' : 'Other'} Qualification</p>
                               <p className="text-sm text-[#584141]"><strong>Document:</strong> {data.fileUrl.split('/').pop() || 'Uploaded'}</p>
                               <div className="flex items-center gap-2 mt-2">
                                 <span className="material-symbols-outlined text-green-700 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                 <span className="text-xs text-green-700 font-medium">Document Uploaded</span>
                               </div>
                             </div>
                           )
                         ))}
                       </div>
                     )}
                   </div>
                </div>
              </section>

              {/* Identification Section */}
              <section className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 relative">
                <div className="sticky top-8 self-start">
                  <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013]">Identification & Status</h3>
                  <p className="text-sm text-[#584141] mt-2">Personal identification and service details.</p>
                </div>
                <div className="bg-[#f6f3ee] p-8 rounded-xl border border-[#ebe8e3] space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Aadhar Card Number</label><p className="text-base font-medium">{formData?.basicDetails?.aadhar || 'N/A'}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Ex-ServiceMen?</label><p className="text-base font-medium">{formatBool(formData?.basicDetails?.exServicemen)}</p></div>
                  </div>
                  <div className="pt-6 border-t border-[#ebe8e3]">
                    <label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold mb-3">Visible Identification Marks</label>
                    <div className="space-y-2">
                      {formData?.basicDetails?.visibleMarks && formData.basicDetails.visibleMarks.length > 0 ? (
                        formData.basicDetails.visibleMarks.map((mark: string, index: number) => (
                          <p key={index} className="text-base font-medium text-[#584141] p-2 bg-[#fcf9f4] rounded border border-[#e5e2dd]">{mark || 'N/A'}</p>
                        ))
                      ) : (
                        <p className="text-base font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Declarations */}
              <section className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 relative">
                {/* 📌 ADDED STICKY CLASSES HERE */}
                <div className="sticky top-8 self-start">
                  <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013]">Application Declarations & Rules</h3>
                </div>
                <div className="bg-[#f6f3ee] p-8 rounded-xl border border-[#ebe8e3] text-[#584141]">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Application Preview:</strong> I verify that all data entered above is accurate.</li>
                    <li><strong>PDF Generation:</strong> I acknowledge a system-generated PDF will be created upon submission.</li>
                    <li><strong>Unique Identification:</strong> I confirm this mobile and email are uniquely registered to me.</li>
                    <li><strong>Email Notifications:</strong> I acknowledge that registration details and the final PDF will be sent to my email.</li>
                  </ul>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-[#ebe8e3] flex flex-col md:flex-row items-center justify-end gap-6">
                <button onClick={() => navigate("/basic-details")} className="w-full md:w-auto px-8 py-3 rounded-lg bg-[#ebe8e3] text-[#1c1c19] font-bold hover:bg-[#dcdad5] transition-all">Edit Application</button>
                <button onClick={() => setShowModal(true)} className="w-full md:w-auto px-10 py-4 rounded-lg bg-[#570013] text-white font-bold shadow-lg hover:bg-[#800020] transition-all flex items-center justify-center">
                  Submit Final Application <span className="material-symbols-outlined ml-2">send</span>
                </button>
              </div>
            </div>

          </main>
        </div>
        <Footer />
      </div>

      {/* ══ SUBMISSION SUCCESS MODAL ══════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1c1c19]/40 backdrop-blur-md z-[100] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="w-20 h-20 bg-[#fed488] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[#570013] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            
            <div className="md:hidden">
              <h3 className="font-['Public_Sans'] font-black text-2xl text-[#570013] mb-2">Submission Received</h3>
              <p className="text-sm text-[#584141] leading-relaxed mb-8">Your application has been securely archived. A verification officer will review your records within 48 business hours.</p>
            </div>
            
            <div className="hidden md:block">
              <h3 className="font-['Public_Sans'] font-extrabold text-2xl text-[#570013] mb-3">Application Submitted Successfully!</h3>
              <p className="text-[#584141] mb-10 leading-relaxed">Your candidate record for 2024 has been logged.</p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#570013] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">{submitting ? 'hourglass_bottom' : 'send'}</span> 
                {submitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
              {submitError && (
                <p className="text-[#ba1a1a] text-sm font-semibold">{submitError}</p>
              )}
              <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl text-[#775a19] font-bold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewPage;