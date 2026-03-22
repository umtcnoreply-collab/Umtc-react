import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import SideNavBar from '../components/SideNavBar';
import Footer from '../components/Footer';
import ProcessTimeline from '../components/ProcessTimeline';
import Toast from '../components/Toast';
import { apiConfig } from '../config/apiConfig';

function BasicDetailsPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  
  // Reusable classes matching the Registration Page UI exactly
  const inputClass = "w-full bg-[#e8f4ff] p-4 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors uppercase placeholder:normal-case placeholder:text-stone-400 tracking-wide";
  const labelClass = "font-['Inter'] font-medium text-sm flex items-center text-[#1c1c19]";
  const radioLabelClass = "flex items-center gap-2 cursor-pointer text-sm font-medium text-[#1c1c19]";
  const radioInputClass = "w-4 h-4 accent-[#324670]";

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  // State for Address Auto-fill Logic
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [permanentAddr, setPermanentAddr] = useState({
    address: '', pincode: '', state: '', district: '', city: '', block: ''
  });
  const [correspondenceAddr, setCorrespondenceAddr] = useState({
    address: '', pincode: '', state: '', district: '', city: '', block: ''
  });

  // State for form data
  const [formData, setFormData] = useState({
    postAppliedFor: '',
    motherName: '',
    fatherName: '',
    debarred: '',
    fir: '',
    govt_emp: '',
    aadhar: '',
    mark1: '',
    mark2: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Fetch existing application data on component mount
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const res = await fetch(apiConfig.application.getApplication, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          console.error('Failed to fetch application data');
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log('Fetched data for editing:', data);

        // Check if application is already submitted
        if (data.applicationStatus === 'Submitted' || data.applicationStatus === 'Approved' || data.applicationStatus === 'Rejected') {
          console.log('Application already submitted, redirecting to profile');
          navigate('/profile', { replace: true });
          return;
        }

        // Pre-fill form data
        if (data.basicDetails) {
          setFormData({
            postAppliedFor: data.basicDetails.postAppliedFor || '',
            motherName: data.basicDetails.motherName || '',
            fatherName: data.basicDetails.fatherName || '',
            debarred: data.basicDetails.debarred ? 'yes' : 'no',
            fir: data.basicDetails.fir ? 'yes' : 'no',
            govt_emp: data.basicDetails.govt_emp ? 'yes' : 'no',
            aadhar: data.basicDetails.aadhar || '',
            mark1: data.basicDetails.visibleMarks?.[0] || '',
            mark2: data.basicDetails.visibleMarks?.[1] || ''
          });
        }

        // Pre-fill permanent address
        if (data.address?.permanentAddress) {
          setPermanentAddr({
            address: data.address.permanentAddress.address || '',
            pincode: data.address.permanentAddress.pincode || '',
            state: data.address.permanentAddress.state || '',
            district: data.address.permanentAddress.district || '',
            city: data.address.permanentAddress.city || '',
            block: data.address.permanentAddress.block || ''
          });
        }

        // Pre-fill correspondence address
        if (data.address?.correspondenceAddress) {
          setCorrespondenceAddr({
            address: data.address.correspondenceAddress.address || '',
            pincode: data.address.correspondenceAddress.pincode || '',
            state: data.address.correspondenceAddress.state || '',
            district: data.address.correspondenceAddress.district || '',
            city: data.address.correspondenceAddress.city || '',
            block: data.address.correspondenceAddress.block || ''
          });
        }

        // Check if addresses are same
        if (data.address?.permanentAddress && data.address?.correspondenceAddress) {
          const isSame = JSON.stringify(data.address.permanentAddress) === JSON.stringify(data.address.correspondenceAddress);
          setIsSameAddress(isSame);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application data:', err);
        setLoading(false);
      }
    };

    if (token) {
      fetchApplicationData();
    }
  }, [token, navigate]);

  // Sync Correspondence Address if checkbox is ticked
  useEffect(() => {
    if (isSameAddress) {
      setCorrespondenceAddr({ ...permanentAddr });
    }
  }, [isSameAddress, permanentAddr]);

  const handlePermChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'pincode') {
      const numericValue = value.replace(/\D/g, '');
      setPermanentAddr(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    setPermanentAddr(prev => ({ ...prev, [name]: value }));
  };

  const handleCorrChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!isSameAddress) {
      if (name === 'pincode') {
        const numericValue = value.replace(/\D/g, '');
        setCorrespondenceAddr(prev => ({ ...prev, [name]: numericValue }));
        return;
      }
      setCorrespondenceAddr(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'aadhar') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      setError('');
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        postAppliedFor: formData.postAppliedFor,
        motherName: formData.motherName,
        fatherName: formData.fatherName,
        debarred: formData.debarred === 'yes',
        fir: formData.fir === 'yes',
        govt_emp: formData.govt_emp === 'yes',
        permanentAddress: permanentAddr,
        correspondenceAddress: isSameAddress ? permanentAddr : correspondenceAddr,
        aadhar: formData.aadhar || null,
        visibleMarks: [formData.mark1, formData.mark2].filter(m => m),
      };

      // console.log('Sending payload:', payload);
      // console.log('Token:', token);

      const res = await fetch(apiConfig.application.updateBasicDetails, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      // console.log('Payload Sent:', payload);

      // console.log('Response Status:', res.status, res.statusText);

      // Handle non-JSON responses (like 404 HTML error pages)
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON Response:', text.substring(0, 200));
        data = { message: `Server error: ${res.statusText}` };
      }

      if (!res.ok) {
        setError(data.message || `Failed to save basic details (${res.status})`);
        setLoading(false);
        return;
      }

      // Show toast and navigate after delay
      setShowToast(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/documents');

    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f8ff] font-['Inter'] text-[#1c1c19] min-h-screen flex flex-col">
      <Toast message="Saved successfully!" visible={showToast} onClose={() => setShowToast(false)} />
      
      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      <div className="md:hidden pt-20 px-4 pb-32 max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#fed488] text-[#9fcb54] text-[10px] font-bold tracking-widest uppercase mb-3 rounded-sm">
            Step 02 / Basic Details
          </div>
          <h2 className="text-3xl font-['Public_Sans'] font-extrabold text-[#324670] tracking-tight leading-none mb-2">Basic & Personal Details</h2>
          <div className="h-1 w-12 bg-[#9fcb54] rounded-full"></div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>
          
          <div className="bg-[#e8f4ff] p-6 rounded-2xl shadow-sm border border-white/50 space-y-8">
            {error && (
              <div className="bg-[#c80000] text-white p-4 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2">Post Details</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass}>Post Applied For <span className="text-[#c80000] ml-1">**</span></label>
                <select name="postAppliedFor" value={formData.postAppliedFor} onChange={handleFormChange} className={`${inputClass} appearance-none`} required>
                  <option value="">Select Post</option>
                  <option value="UDC">UDC</option>
                  <option value="Office Assistant">Office Assistant</option>
                  <option value="MTS">MTS</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2 pt-4">Family Details</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className={labelClass}>Mother Name <span className="text-[#c80000] ml-1">**</span></label><input name="motherName" value={formData.motherName} onChange={handleFormChange} className={inputClass} type="text" placeholder="Enter full name" required /></div>
              <div className="space-y-2"><label className={labelClass}>Father Name <span className="text-[#c80000] ml-1">**</span></label><input name="fatherName" value={formData.fatherName} onChange={handleFormChange} className={inputClass} type="text" placeholder="Enter full name" required /></div>
            </div>

            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2 pt-4">Background Info</h3>
            <div className="space-y-6">
              <div className="space-y-3"><label className={labelClass}>Debarred by department? <span className="text-[#c80000] ml-1">**</span></label><div className="flex gap-6"><label className={radioLabelClass}><input type="radio" name="debarred" value="yes" checked={formData.debarred === 'yes'} onChange={handleFormChange} className={radioInputClass} required /> Yes</label><label className={radioLabelClass}><input type="radio" name="debarred" value="no" checked={formData.debarred === 'no'} onChange={handleFormChange} className={radioInputClass} /> No</label></div></div>
              <div className="space-y-3"><label className={labelClass}>Pending FIRs/Cases? <span className="text-[#c80000] ml-1">**</span></label><div className="flex gap-6"><label className={radioLabelClass}><input type="radio" name="fir" value="yes" checked={formData.fir === 'yes'} onChange={handleFormChange} className={radioInputClass} required /> Yes</label><label className={radioLabelClass}><input type="radio" name="fir" value="no" checked={formData.fir === 'no'} onChange={handleFormChange} className={radioInputClass} /> No</label></div></div>
              <div className="space-y-3"><label className={labelClass}>Are you Govt. Employee? <span className="text-[#c80000] ml-1">*</span></label><div className="flex gap-6"><label className={radioLabelClass}><input type="radio" name="govt_emp" value="yes" checked={formData.govt_emp === 'yes'} onChange={handleFormChange} className={radioInputClass} required /> Yes</label><label className={radioLabelClass}><input type="radio" name="govt_emp" value="no" checked={formData.govt_emp === 'no'} onChange={handleFormChange} className={radioInputClass} /> No</label></div></div>
            </div>
          </div>

          <div className="bg-[#e8f4ff] p-6 rounded-2xl shadow-sm border border-white/50 space-y-8">
            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2">Permanent Address</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className={labelClass}>Address <span className="text-[#c80000] ml-1">**</span></label><input name="address" value={permanentAddr.address} className={inputClass} placeholder="Enter full address" onChange={handlePermChange} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className={labelClass}>Pin code <span className="text-[#c80000] ml-1">*</span></label><input name="pincode" value={permanentAddr.pincode} className={inputClass} placeholder="6-Digits" maxLength={6} pattern="\d{6}" inputMode="numeric" onChange={handlePermChange} required /></div>
                <div className="space-y-2"><label className={labelClass}>State <span className="text-[#c80000] ml-1">*</span></label><select name="state" value={permanentAddr.state} className={`${inputClass} appearance-none`} onChange={handlePermChange} required><option value="">Select</option>{indianStates.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="space-y-2"><label className={labelClass}>District <span className="text-[#c80000] ml-1">*</span></label><input name="district" value={permanentAddr.district} className={inputClass} placeholder="Enter District" onChange={handlePermChange} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className={labelClass}>City/Village <span className="text-[#c80000] ml-1">*</span></label><input name="city" value={permanentAddr.city} className={inputClass} placeholder="Enter City" onChange={handlePermChange} required /></div>
                <div className="space-y-2"><label className={labelClass}>Block <span className="text-[#c80000] ml-1">*</span></label><input name="block" value={permanentAddr.block} className={inputClass} placeholder="Enter Block" onChange={handlePermChange} required /></div>
              </div>
            </div>

            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2 pt-4">Correspondence Address</h3>
            <div className="space-y-6">
              <label className="flex items-start gap-3 bg-[#e5e2dd] p-4 rounded cursor-pointer">
                <input type="checkbox" checked={isSameAddress} onChange={(e) => setIsSameAddress(e.target.checked)} className="mt-1 accent-[#324670]" />
                <span className="text-sm font-medium">Tick here if correspondance Address is Same as Permanent</span>
              </label>
              {!isSameAddress && (
                <div className="space-y-6">
                  <input name="address" placeholder="Address" className={inputClass} value={correspondenceAddr.address} onChange={handleCorrChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="pincode" placeholder="Pin code" className={inputClass} value={correspondenceAddr.pincode} inputMode="numeric" maxLength={6} pattern="\d{6}" onChange={handleCorrChange} required />
                    <select name="state" className={`${inputClass} appearance-none`} value={correspondenceAddr.state} onChange={handleCorrChange} required><option value="">Select</option>{indianStates.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#e8f4ff] p-6 rounded-2xl shadow-sm border border-white/50 space-y-8">
            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2">Identification</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className={labelClass}>Aadhar Card Number</label><input name="aadhar" value={formData.aadhar} onChange={handleFormChange} className={inputClass} placeholder="Enter Aadhar Number" maxLength={12} pattern="\d{12}" inputMode="numeric" /></div>
              <div className="space-y-4">
                <label className={labelClass}>Visible Identification Marks</label>
                <input name="mark1" value={formData.mark1} onChange={handleFormChange} className={inputClass} placeholder="Mark 1" />
                <input name="mark2" value={formData.mark2} onChange={handleFormChange} className={inputClass} placeholder="Mark 2" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#324670] text-white py-4 px-6 rounded-lg font-['Public_Sans'] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save & Next'} <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
        <Footer />
      </div>

      {/* ══ DESKTOP LAYOUT ═══════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <main className="flex-grow flex w-full max-w-7xl mx-auto px-8 py-12">
          <SideNavBar activePath="/basic-details" />
          
          <div className="flex-1">
            <ProcessTimeline currentStep={2} />
            <header className="mb-16">
              <h1 className="font-['Public_Sans'] text-[3.5rem] leading-none font-extrabold tracking-tighter text-[#324670]">Basic &amp; Personal Details</h1>
              <div className="h-1 w-24 bg-[#9fcb54] mt-6"></div>
            </header>

            <form className="space-y-16" onSubmit={handleSubmit}>
              
              {/* 0. POST APPLIED FOR SECTION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Post Details</h3>
                    <p className="text-[#324670] leading-relaxed text-sm">Select the post you are applying for.</p>
                  </div>
                </div>
                
                <div className="bg-[#e8f4ff] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="space-y-2">
                    <label className={labelClass}>Post Applied For <span className="text-[#c80000] ml-1">**</span></label>
                    <select name="postAppliedFor" value={formData.postAppliedFor} onChange={handleFormChange} className={`${inputClass} appearance-none`} required>
                      <option value="">SELECT POST</option>
                      <option value="UDC">UDC</option>
                      <option value="Office Assistant">OFFICE ASSISTANT</option>
                      <option value="MTS">MTS</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 1. FAMILY & BACKGROUND SECTION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Family & Background</h3>
                    <p className="text-[#324670] leading-relaxed text-sm">Please provide your family details and answer the background verification questions honestly.</p>
                  </div>
                </div>
                
                <div className="bg-[#e8f4ff] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  {error && (
                    <div className="bg-[#c80000] text-white p-4 rounded-lg text-sm font-medium mb-6">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Mother Name <span className="text-[#c80000] ml-1">**</span></label>
                      <input name="motherName" value={formData.motherName} onChange={handleFormChange} className={inputClass} type="text" placeholder="Enter Mother's Name" required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Father Name <span className="text-[#c80000] ml-1">**</span></label>
                      <input name="fatherName" value={formData.fatherName} onChange={handleFormChange} className={inputClass} type="text" placeholder="Enter Father's Name" required />
                    </div>
                  </div>

                  <hr className="border-[#32467033]" />

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className={labelClass}>Have you ever been debarred by department? <span className="text-[#c80000] ml-1">**</span></label>
                      <div className="flex gap-8">
                        <label className={radioLabelClass}><input type="radio" name="debarred" value="yes" checked={formData.debarred === 'yes'} onChange={handleFormChange} className={radioInputClass} required /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="debarred" value="no" checked={formData.debarred === 'no'} onChange={handleFormChange} className={radioInputClass} /> No</label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Do you have any pending FIRs/ Criminal Cases? <span className="text-[#c80000] ml-1">**</span></label>
                      <p className="text-[10px] text-[#324670] uppercase tracking-wider mb-2">Allegations of misconduct, disciplinary proceeding, investigation and civil cases</p>
                      <div className="flex gap-8">
                        <label className={radioLabelClass}><input type="radio" name="fir" value="yes" checked={formData.fir === 'yes'} onChange={handleFormChange} className={radioInputClass} required /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="fir" value="no" checked={formData.fir === 'no'} onChange={handleFormChange} className={radioInputClass} /> No</label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Are you Govt. Employee? <span className="text-[#c80000] ml-1">*</span></label>
                      <p className="text-[10px] text-[#324670] uppercase tracking-wider mb-2">Employee in state/Central Govt / Public sector unit?</p>
                      <div className="flex gap-8">
                        <label className={radioLabelClass}><input type="radio" name="govt_emp" value="yes" checked={formData.govt_emp === 'yes'} onChange={handleFormChange} className={radioInputClass} required /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="govt_emp" value="no" checked={formData.govt_emp === 'no'} onChange={handleFormChange} className={radioInputClass} /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. ADDRESS DETAILS SECTION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Address Details</h3>
                    <p className="text-[#324670] leading-relaxed text-sm">Enter your permanent residency details. If your current mailing address differs, uncheck the box to provide it.</p>
                  </div>
                </div>
                
                <div className="bg-[#e8f4ff] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="space-y-2">
                    <label className={labelClass}>Permanent Address <span className="text-[#c80000] ml-1">**</span></label>
                    <input name="address" value={permanentAddr.address} className={inputClass} placeholder="Enter full address" type="text" onChange={handlePermChange} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Pin code <span className="text-[#c80000] ml-1">*</span></label>
                      <input name="pincode" value={permanentAddr.pincode} className={inputClass} placeholder="ENTER PIN CODE" type="text" maxLength={6} pattern="\d{6}" inputMode="numeric" onChange={handlePermChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>State <span className="text-[#c80000] ml-1">*</span></label>
                      <select name="state" value={permanentAddr.state} className={`${inputClass} appearance-none`} onChange={handlePermChange} required>
                        <option value="">SELECT STATE</option>
                        {indianStates.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className={labelClass}>District <span className="text-[#c80000] ml-1">*</span></label>
                      <input name="district" value={permanentAddr.district} className={inputClass} placeholder="SELECT DISTRICT" onChange={handlePermChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>City/Town/Village <span className="text-[#c80000] ml-1">*</span></label>
                      <input name="city" value={permanentAddr.city} className={inputClass} placeholder="ENTER CITY" onChange={handlePermChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Block <span className="text-[#c80000] ml-1">*</span></label>
                      <input name="block" value={permanentAddr.block} className={inputClass} placeholder="ENTER BLOCK" onChange={handlePermChange} required />
                    </div>
                  </div>

                  <hr className="border-[#32467033]" />

                  <div className="space-y-6">
                    <label className="flex items-center gap-3 bg-[#e5e2dd] p-4 rounded cursor-pointer">
                      <input type="checkbox" className={radioInputClass} onChange={(e) => setIsSameAddress(e.target.checked)} />
                      <span className="text-sm font-medium text-[#1c1c19]">Please tick here if correspondance Address is Same as Permanent Address</span>
                    </label>
                    
                    <div className={`space-y-6 transition-opacity duration-300 ${isSameAddress ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <div className="space-y-2">
                        <label className={labelClass}>Correspondence Address <span className="text-[#c80000] ml-1">**</span></label>
                        <input name="address" className={inputClass} placeholder="ENTER FULL ADDRESS" value={correspondenceAddr.address} onChange={handleCorrChange} required={!isSameAddress} />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className={labelClass}>Pin code <span className="text-[#c80000] ml-1">*</span></label>
                          <input name="pincode" className={inputClass} placeholder="ENTER PIN CODE" inputMode="numeric" maxLength={6} pattern="\d{6}" value={correspondenceAddr.pincode} onChange={handleCorrChange} required={!isSameAddress} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>State <span className="text-[#c80000] ml-1">*</span></label>
                          <select name="state" className={`${inputClass} appearance-none`} value={correspondenceAddr.state} onChange={handleCorrChange} required={!isSameAddress}>
                            <option value="">SELECT STATE</option>
                            {indianStates.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. IDENTIFICATION SECTION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Identification & Status</h3>
                    <p className="text-[#324670] leading-relaxed text-sm">Provide unique identifiers and specific category statuses if applicable.</p>
                  </div>
                </div>
                
                <div className="bg-[#e8f4ff] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="space-y-2">
                    <label className={labelClass}>Aadhar Card Number</label>
                    <input name="aadhar" value={formData.aadhar} onChange={handleFormChange} className={inputClass} type="text" maxLength={12} pattern="\d{12}" inputMode="numeric" placeholder="ENTER AADHAR NUMBER" />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Details of visible Identification marks on the body</label>
                    <div className="space-y-4 pt-2">
                      <input name="mark1" value={formData.mark1} onChange={handleFormChange} className={inputClass} placeholder="IDENTIFICATION MARK 1" />
                      <input name="mark2" value={formData.mark2} onChange={handleFormChange} className={inputClass} placeholder="IDENTIFICATION MARK 2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className={labelClass}>Ex-ServiceMen?</label>
                      <div className="flex gap-8 mt-2">
                        <label className={radioLabelClass}><input type="radio" name="exserv" className={radioInputClass} /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="exserv" className={radioInputClass} /> No</label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>PwBD (40% and above)?</label>
                      <div className="flex gap-8 mt-2">
                        <label className={radioLabelClass}><input type="radio" name="pwbd" className={radioInputClass} /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="pwbd" className={radioInputClass} /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. SECURITY VERIFICATION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                 <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Security Validation</h3>
                  </div>
                </div>
                
                <div className="bg-[#e8f4ff] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Confirm Mobile Number <span className="text-[#c80000] ml-1">*</span></label>
                      <input className={inputClass} type="tel" maxLength={10} placeholder="RE-ENTER MOBILE NUMBER" required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Confirm Email ID <span className="text-[#c80000] ml-1">*</span></label>
                      <input className={inputClass} type="email" placeholder="RE-ENTER EMAIL ADDRESS" required />
                    </div>
                  </div>
                </div>
              </section>

              {/* SUBMIT */}
              <div className="pt-6 border-t border-[#32467033] flex justify-end">
                <button 
                  disabled={loading}
                  className="bg-[#324670] text-white py-5 px-10 rounded-lg font-['Public_Sans'] font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#9fcb54] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  {loading ? 'Saving...' : 'Save & Next'} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default BasicDetailsPage;


