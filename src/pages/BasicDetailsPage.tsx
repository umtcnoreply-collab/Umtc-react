import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';
import Footer from '../components/Footer';

function BasicDetailsPage() {
  const navigate = useNavigate();
  
  // Reusable classes matching the Registration Page UI exactly
  const inputClass = "w-full bg-[#ebe8e3] p-4 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors uppercase placeholder:normal-case placeholder:text-stone-400 tracking-wide";
  const labelClass = "font-['Inter'] font-medium text-sm flex items-center text-[#1c1c19]";
  const radioLabelClass = "flex items-center gap-2 cursor-pointer text-sm font-medium text-[#1c1c19]";
  const radioInputClass = "w-4 h-4 accent-[#570013]";

  // State for Address Auto-fill Logic
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [permanentAddr, setPermanentAddr] = useState({
    address: '', pincode: '', state: '', district: '', city: '', block: ''
  });
  const [correspondenceAddr, setCorrespondenceAddr] = useState({
    address: '', pincode: '', state: '', district: '', city: '', block: ''
  });

  // Sync Correspondence Address if checkbox is ticked
  useEffect(() => {
    if (isSameAddress) {
      setCorrespondenceAddr({ ...permanentAddr });
    }
  }, [isSameAddress, permanentAddr]);

  const handlePermChange = (e) => {
    const { name, value } = e.target;
    setPermanentAddr(prev => ({ ...prev, [name]: value }));
  };

  const handleCorrChange = (e) => {
    const { name, value } = e.target;
    if (!isSameAddress) {
      setCorrespondenceAddr(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/documents");
  };

  return (
    <div className="bg-[#fcf9f4] font-['Inter'] text-[#1c1c19] min-h-screen flex flex-col">
      
      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      <div className="md:hidden pt-20 px-4 pb-32 max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#fed488] text-[#775a19] text-[10px] font-bold tracking-widest uppercase mb-3 rounded-sm">
            Step 02 / Basic Details
          </div>
          <h2 className="text-3xl font-['Public_Sans'] font-extrabold text-[#570013] tracking-tight leading-none mb-2">Basic & Personal Details</h2>
          <div className="h-1 w-12 bg-[#775a19] rounded-full"></div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>
          
          <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 space-y-8">
            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#570013] border-b border-[#8c707133] pb-2">Family Details</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className={labelClass}>Mother Name <span className="text-[#ba1a1a] ml-1">**</span></label><input className={inputClass} type="text" placeholder="Enter full name" required /></div>
              <div className="space-y-2"><label className={labelClass}>Father Name <span className="text-[#ba1a1a] ml-1">**</span></label><input className={inputClass} type="text" placeholder="Enter full name" required /></div>
            </div>

            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#570013] border-b border-[#8c707133] pb-2 pt-4">Background Info</h3>
            <div className="space-y-6">
              <div className="space-y-3"><label className={labelClass}>Debarred by department? <span className="text-[#ba1a1a] ml-1">**</span></label><div className="flex gap-6"><label className={radioLabelClass}><input type="radio" name="m-deb" className={radioInputClass} required /> Yes</label><label className={radioLabelClass}><input type="radio" name="m-deb" className={radioInputClass} /> No</label></div></div>
              <div className="space-y-3"><label className={labelClass}>Pending FIRs/Cases? <span className="text-[#ba1a1a] ml-1">**</span></label><div className="flex gap-6"><label className={radioLabelClass}><input type="radio" name="m-fir" className={radioInputClass} required /> Yes</label><label className={radioLabelClass}><input type="radio" name="m-fir" className={radioInputClass} /> No</label></div></div>
              <div className="space-y-3"><label className={labelClass}>Are you Govt. Employee? <span className="text-[#ba1a1a] ml-1">*</span></label><div className="flex gap-6"><label className={radioLabelClass}><input type="radio" name="m-govt" className={radioInputClass} required /> Yes</label><label className={radioLabelClass}><input type="radio" name="m-govt" className={radioInputClass} /> No</label></div></div>
            </div>
          </div>

          <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 space-y-8">
            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#570013] border-b border-[#8c707133] pb-2">Permanent Address</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className={labelClass}>Address <span className="text-[#ba1a1a] ml-1">**</span></label><input name="address" className={inputClass} placeholder="Enter full address" onChange={handlePermChange} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className={labelClass}>Pin code <span className="text-[#ba1a1a] ml-1">*</span></label><input name="pincode" className={inputClass} placeholder="6-Digits" maxLength={6} pattern="\d{6}" onChange={handlePermChange} required /></div>
                <div className="space-y-2"><label className={labelClass}>State <span className="text-[#ba1a1a] ml-1">*</span></label><select name="state" className={`${inputClass} appearance-none`} onChange={handlePermChange} required><option value="">Select</option><option value="Delhi">Delhi</option></select></div>
              </div>
              <div className="space-y-2"><label className={labelClass}>District <span className="text-[#ba1a1a] ml-1">*</span></label><input name="district" className={inputClass} placeholder="Enter District" onChange={handlePermChange} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className={labelClass}>City/Village <span className="text-[#ba1a1a] ml-1">*</span></label><input name="city" className={inputClass} placeholder="Enter City" onChange={handlePermChange} required /></div>
                <div className="space-y-2"><label className={labelClass}>Block <span className="text-[#ba1a1a] ml-1">*</span></label><input name="block" className={inputClass} placeholder="Enter Block" onChange={handlePermChange} required /></div>
              </div>
            </div>

            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#570013] border-b border-[#8c707133] pb-2 pt-4">Correspondence Address</h3>
            <div className="space-y-6">
              <label className="flex items-start gap-3 bg-[#e5e2dd] p-4 rounded cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#570013]" onChange={(e) => setIsSameAddress(e.target.checked)} />
                <span className="text-sm font-medium">Tick here if correspondance Address is Same as Permanent</span>
              </label>
              {!isSameAddress && (
                <div className="space-y-6">
                  <input name="address" placeholder="Address" className={inputClass} value={correspondenceAddr.address} onChange={handleCorrChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="pincode" placeholder="Pin code" className={inputClass} value={correspondenceAddr.pincode} onChange={handleCorrChange} required />
                    <input name="state" placeholder="State" className={inputClass} value={correspondenceAddr.state} onChange={handleCorrChange} required />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 space-y-8">
            <h3 className="text-lg font-['Public_Sans'] font-bold text-[#570013] border-b border-[#8c707133] pb-2">Identification</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className={labelClass}>Aadhar Card Number</label><input className={inputClass} placeholder="12-Digits (Optional)" maxLength={12} pattern="\d{12}" /></div>
              <div className="space-y-4">
                <label className={labelClass}>Visible Identification Marks</label>
                <input className={inputClass} placeholder="Mark 1" />
                <input className={inputClass} placeholder="Mark 2" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button type="submit" className="w-full bg-[#570013] text-white py-4 px-6 rounded-lg font-['Public_Sans'] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
              Save &amp; Next <span className="material-symbols-outlined">arrow_forward</span>
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
              <h1 className="font-['Public_Sans'] text-[3.5rem] leading-none font-extrabold tracking-tighter text-[#570013]">Basic &amp; Personal Details</h1>
              <div className="h-1 w-24 bg-[#775a19] mt-6"></div>
            </header>

            <form className="space-y-16" onSubmit={handleSubmit}>
              
              {/* 1. FAMILY & BACKGROUND SECTION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#570013] mb-4">Family & Background</h3>
                    <p className="text-[#584141] leading-relaxed text-sm">Please provide your family details and answer the background verification questions honestly.</p>
                  </div>
                </div>
                
                <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Mother Name <span className="text-[#ba1a1a] ml-1">**</span></label>
                      <input className={inputClass} type="text" placeholder="Enter Mother's Name" required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Father Name <span className="text-[#ba1a1a] ml-1">**</span></label>
                      <input className={inputClass} type="text" placeholder="Enter Father's Name" required />
                    </div>
                  </div>

                  <hr className="border-[#8c707133]" />

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className={labelClass}>Have you ever been debarred by department? <span className="text-[#ba1a1a] ml-1">**</span></label>
                      <div className="flex gap-8">
                        <label className={radioLabelClass}><input type="radio" name="debarred" className={radioInputClass} required /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="debarred" className={radioInputClass} /> No</label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Do you have any pending FIRs/ Criminal Cases? <span className="text-[#ba1a1a] ml-1">**</span></label>
                      <p className="text-[10px] text-[#584141] uppercase tracking-wider mb-2">Allegations of misconduct, disciplinary proceeding, investigation and civil cases</p>
                      <div className="flex gap-8">
                        <label className={radioLabelClass}><input type="radio" name="fir" className={radioInputClass} required /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="fir" className={radioInputClass} /> No</label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Are you Govt. Employee? <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <p className="text-[10px] text-[#584141] uppercase tracking-wider mb-2">Employee in state/Central Govt / Public sector unit?</p>
                      <div className="flex gap-8">
                        <label className={radioLabelClass}><input type="radio" name="govt_emp" className={radioInputClass} required /> Yes</label>
                        <label className={radioLabelClass}><input type="radio" name="govt_emp" className={radioInputClass} /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. ADDRESS DETAILS SECTION */}
              <section className="grid grid-cols-[1fr_2fr] gap-16">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#570013] mb-4">Address Details</h3>
                    <p className="text-[#584141] leading-relaxed text-sm">Enter your permanent residency details. If your current mailing address differs, uncheck the box to provide it.</p>
                  </div>
                </div>
                
                <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="space-y-2">
                    <label className={labelClass}>Permanent Address <span className="text-[#ba1a1a] ml-1">**</span></label>
                    <input name="address" className={inputClass} placeholder="Enter full address" type="text" onChange={handlePermChange} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Pin code <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input name="pincode" className={inputClass} placeholder="6-DIGIT NUMERICAL" type="text" maxLength={6} pattern="\d{6}" onChange={handlePermChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>State <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <select name="state" className={`${inputClass} appearance-none`} onChange={handlePermChange} required>
                        <option value="">SELECT STATE</option>
                        <option value="Delhi">DELHI</option>
                        <option value="Maharashtra">MAHARASHTRA</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className={labelClass}>District <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input name="district" className={inputClass} placeholder="SELECT DISTRICT" onChange={handlePermChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>City/Town/Village <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input name="city" className={inputClass} placeholder="ENTER CITY" onChange={handlePermChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Block <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input name="block" className={inputClass} placeholder="ENTER BLOCK" onChange={handlePermChange} required />
                    </div>
                  </div>

                  <hr className="border-[#8c707133]" />

                  <div className="space-y-6">
                    <label className="flex items-center gap-3 bg-[#e5e2dd] p-4 rounded cursor-pointer">
                      <input type="checkbox" className={radioInputClass} onChange={(e) => setIsSameAddress(e.target.checked)} />
                      <span className="text-sm font-medium text-[#1c1c19]">Please tick here if correspondance Address is Same as Permanent Address</span>
                    </label>
                    
                    <div className={`space-y-6 transition-opacity duration-300 ${isSameAddress ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <div className="space-y-2">
                        <label className={labelClass}>Correspondence Address <span className="text-[#ba1a1a] ml-1">**</span></label>
                        <input name="address" className={inputClass} placeholder="ENTER FULL ADDRESS" value={correspondenceAddr.address} onChange={handleCorrChange} required={!isSameAddress} />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className={labelClass}>Pin code <span className="text-[#ba1a1a] ml-1">*</span></label>
                          <input name="pincode" className={inputClass} placeholder="6-DIGIT NUMERICAL" value={correspondenceAddr.pincode} onChange={handleCorrChange} required={!isSameAddress} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>State <span className="text-[#ba1a1a] ml-1">*</span></label>
                          <input name="state" className={inputClass} placeholder="STATE" value={correspondenceAddr.state} onChange={handleCorrChange} required={!isSameAddress} />
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
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#570013] mb-4">Identification & Status</h3>
                    <p className="text-[#584141] leading-relaxed text-sm">Provide unique identifiers and specific category statuses if applicable.</p>
                  </div>
                </div>
                
                <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="space-y-2">
                    <label className={labelClass}>Aadhar Card Number</label>
                    <input className={inputClass} type="text" maxLength={12} pattern="\d{12}" placeholder="12-DIGIT NUMERICAL" />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Details of visible Identification marks on the body</label>
                    <div className="space-y-4 pt-2">
                      <input className={inputClass} placeholder="IDENTIFICATION MARK 1" />
                      <input className={inputClass} placeholder="IDENTIFICATION MARK 2" />
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
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#570013] mb-4">Security Validation</h3>
                  </div>
                </div>
                
                <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Confirm Mobile Number <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input className={inputClass} type="tel" maxLength={10} placeholder="RE-ENTER MOBILE NUMBER" required />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Confirm Email ID <span className="text-[#ba1a1a] ml-1">*</span></label>
                      <input className={inputClass} type="email" placeholder="RE-ENTER EMAIL ADDRESS" required />
                    </div>
                  </div>
                </div>
              </section>

              {/* SUBMIT */}
              <div className="pt-6 border-t border-[#8c707133] flex justify-end">
                <button className="bg-[#570013] text-white py-5 px-10 rounded-lg font-['Public_Sans'] font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#800020] transition-all flex items-center justify-center gap-3" type="submit">
                  Save &amp; Next <span className="material-symbols-outlined">arrow_forward</span>
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