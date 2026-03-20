import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';

function PreviewPage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // MOCK DATA: Replace this with your actual state/context data
  const mockFormData = {
    registration: {
      mobile: "9876543210",
      candidateName: "ALEXANDER STERLING THORNE",
      dob: "14 MAY 1992",
      gender: "MALE",
      nationality: "INDIAN",
      category: "GENERAL",
      email: "ALEXANDER@DOMAIN.COM"
    },
    basicDetails: {
      motherName: "ELEANOR THORNE",
      fatherName: "RICHARD THORNE",
      debarred: "NO",
      criminalCase: "NO",
      govtEmployee: "NO"
    },
    address: {
      permanentAddress: "123 HERITAGE APARTMENTS, SECTOR 45",
      pinCode: "110001",
      state: "DELHI"
    },
    documents: {
      photo: "Passport_Photograph.jpg",
      signature: "Digital_Signature.jpg",
      tenthBoard: "CBSE",
      tenthRollNo: "87654321",
      tenthMarksheet: "10th_Marksheet.pdf"
    }
  };

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
                <p className="text-[#1c1c19] font-medium">{mockFormData.registration.candidateName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Mobile Number</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.registration.mobile}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Email Address</label><p className="text-[#1c1c19] font-medium text-sm break-all">{mockFormData.registration.email}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Date of Birth</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.registration.dob}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Gender</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.registration.gender}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Nationality</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.registration.nationality}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Category</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.registration.category}</p></div>
              </div>
            </div>
          </section>

          {/* 2. Basic Details & Address */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Basic Details</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-6 space-y-4 shadow-sm border border-[#e5e2dd]">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Mother Name</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.basicDetails.motherName}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Father Name</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.basicDetails.fatherName}</p></div>
              </div>
              
              <div className="pt-2 border-t border-[#e5e2dd]">
                <label className="text-[10px] font-bold text-[#584141] uppercase">Permanent Address</label>
                <p className="text-[#1c1c19] font-medium text-sm">{mockFormData.address.permanentAddress}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div><label className="text-[10px] font-bold text-[#584141] uppercase">State</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.address.state}</p></div>
                  <div><label className="text-[10px] font-bold text-[#584141] uppercase">Pin Code</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.address.pinCode}</p></div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e5e2dd] grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Debarred?</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.basicDetails.debarred}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Criminal Cases?</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.basicDetails.criminalCase}</p></div>
                <div><label className="text-[10px] font-bold text-[#584141] uppercase">Govt Employee?</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.basicDetails.govtEmployee}</p></div>
              </div>
            </div>
          </section>

          {/* 3. Documentation */}
          <section>
            <h2 className="font-['Public_Sans'] font-bold text-lg text-[#570013] tracking-wide mb-4 sticky top-20 bg-[#fcf9f4] py-2 z-10">Uploaded Documents</h2>
            <div className="bg-[#f6f3ee] rounded-xl p-4 space-y-3 shadow-sm border border-[#e5e2dd]">
              {[mockFormData.documents.photo, mockFormData.documents.signature, mockFormData.documents.tenthMarksheet].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#fcf9f4] rounded-lg border border-[#e5e2dd]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="material-symbols-outlined text-[#775a19] text-sm shrink-0">{file.includes('.jpg') ? 'image' : 'file_present'}</span>
                    <span className="text-xs font-medium truncate">{file}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#775a19] text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-[#e5e2dd] grid grid-cols-2 gap-4 px-2">
                 <div><label className="text-[10px] font-bold text-[#584141] uppercase">10th Board</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.documents.tenthBoard}</p></div>
                 <div><label className="text-[10px] font-bold text-[#584141] uppercase">10th Roll No</label><p className="text-[#1c1c19] font-medium text-sm">{mockFormData.documents.tenthRollNo}</p></div>
              </div>
            </div>
          </section>

          {/* 4. Declarations & Rules */}
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
          <main className="flex-1 bg-[#fcf9f4] overflow-y-auto pl-8 pb-12 relative">
            
            <div className="mb-16">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#ebe8e3] -z-10"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#775a19] text-white flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Registration</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#775a19] text-white flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Basic Details</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#775a19] text-white flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Documents</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#570013] text-white flex items-center justify-center font-bold shadow-md">4</div>
                  <span className="text-sm font-['Inter'] text-[#570013] font-semibold">Preview</span>
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
                    <div className="col-span-2"><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Candidate Name</label><p className="text-lg font-medium">{mockFormData.registration.candidateName}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Mobile Number</label><p className="text-base font-medium">{mockFormData.registration.mobile}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Email Address</label><p className="text-base font-medium">{mockFormData.registration.email}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Date of Birth</label><p className="text-base font-medium">{mockFormData.registration.dob}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Gender</label><p className="text-base font-medium">{mockFormData.registration.gender}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Nationality</label><p className="text-base font-medium">{mockFormData.registration.nationality}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Category</label><p className="text-base font-medium">{mockFormData.registration.category}</p></div>
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
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Mother Name</label><p className="text-base font-medium">{mockFormData.basicDetails.motherName}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Father Name</label><p className="text-base font-medium">{mockFormData.basicDetails.fatherName}</p></div>
                  </div>
                  
                  <div className="pt-6 border-t border-[#ebe8e3]">
                    <label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Permanent Address</label>
                    <p className="text-base font-medium">{mockFormData.address.permanentAddress}</p>
                    <div className="grid grid-cols-2 gap-8 mt-4">
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">State</label><p className="text-base font-medium">{mockFormData.address.state}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Pin Code</label><p className="text-base font-medium">{mockFormData.address.pinCode}</p></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#ebe8e3] grid grid-cols-3 gap-6">
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Debarred?</label><p className="text-base font-medium">{mockFormData.basicDetails.debarred}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Criminal Case?</label><p className="text-base font-medium">{mockFormData.basicDetails.criminalCase}</p></div>
                    <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">Govt Employee?</label><p className="text-base font-medium">{mockFormData.basicDetails.govtEmployee}</p></div>
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
                   <div className="grid grid-cols-2 gap-4 mb-8">
                     {[mockFormData.documents.photo, mockFormData.documents.signature, mockFormData.documents.tenthMarksheet].map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-[#fcf9f4] rounded-lg border border-[#ebe8e3]">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#775a19]">file_present</span>
                            <span className="text-sm font-medium">{file}</span>
                          </div>
                          <span className="material-symbols-outlined text-green-700" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                     ))}
                   </div>
                   <div className="pt-6 border-t border-[#ebe8e3] grid grid-cols-2 gap-8">
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">10th Board</label><p className="text-base font-medium">{mockFormData.documents.tenthBoard}</p></div>
                      <div><label className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">10th Roll Number</label><p className="text-base font-medium">{mockFormData.documents.tenthRollNo}</p></div>
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
              <button className="w-full py-4 rounded-xl bg-[#570013] text-white font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">download</span> Download PDF
              </button>
              <button onClick={() => navigate("/login")} className="w-full py-3 rounded-xl text-[#775a19] font-bold">
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewPage;