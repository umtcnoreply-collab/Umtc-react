import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';
type QualLevel = 'tenth' | 'twelfth' | 'grad' | 'other';
type QualField = 'name' | 'board' | 'year' | 'roll' | 'marks' | 'total' | 'percentage' | 'file';

function DocumentsPage() {
  const navigate = useNavigate();

  // Reusable styling classes
  const inputClass = "w-full bg-[#ebe8e3] p-3 border-b-2 border-[#8c707133] focus:border-[#570013] focus:outline-none transition-colors text-sm placeholder:text-stone-400";
  const labelClass = "font-['Inter'] font-medium text-sm text-[#1c1c19] mb-1 block";

  // State for Academic Qualifications
  const [qualifications, setQualifications] = useState({
  tenth: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
  twelfth: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
  grad: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
  other: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null }
});
  // Auto-calculate percentage logic
const handleQualChange = (level: QualLevel, field: QualField, value: string | File | null) => {
      setQualifications((prev) => {
      const updatedLevel = { ...prev[level], [field]: value };

      // Auto-calculate if marks or total changes
      if (field === 'marks' || field === 'total') {
        const m = parseFloat(updatedLevel.marks);
        const t = parseFloat(updatedLevel.total);
        if (!isNaN(m) && !isNaN(t) && t > 0 && m <= t) {
          updatedLevel.percentage = ((m / t) * 100).toFixed(2);
        } else {
          updatedLevel.percentage = '';
        }
      }
      return { ...prev, [level]: updatedLevel };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/preview");
  };

  // Helper for generating table rows (Desktop)
  const renderTableRow = (level: QualLevel, label: string, isRequired: boolean) => {
    const data = qualifications[level];
    return (
      <tr className="border-b border-[#8c707133] hover:bg-[#e5e2dd]/30 transition-colors">
        <td className="p-3 font-semibold text-sm text-[#570013] whitespace-nowrap">
          {level === 'other' ? (
            <input className={inputClass} placeholder="Other (Optional)" value={data.name} onChange={(e) => handleQualChange(level, 'name', e.target.value)} />
          ) : (
            <>{label} {isRequired && <span className="text-[#ba1a1a]">*</span>}</>
          )}
        </td>
        <td className="p-2">
          {level === 'tenth' ? (
            <select className={`${inputClass} appearance-none`} value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired}>
              <option value="">Select Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </select>
          ) : (
            <input className={inputClass} type="text" placeholder="Institution/Board" value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired} />
          )}
        </td>
        <td className="p-2"><input className={inputClass} type="text" placeholder="YYYY" maxLength={4} value={data.year} onChange={(e) => handleQualChange(level, 'year', e.target.value)} required={isRequired} /></td>
        <td className="p-2"><input className={inputClass} type="text" placeholder="Roll No" value={data.roll} onChange={(e) => handleQualChange(level, 'roll', e.target.value)} required={isRequired} /></td>
        <td className="p-2"><input className={inputClass} type="number" placeholder="0" value={data.marks} onChange={(e) => handleQualChange(level, 'marks', e.target.value)} required={isRequired} /></td>
        <td className="p-2"><input className={inputClass} type="number" placeholder="0" value={data.total} onChange={(e) => handleQualChange(level, 'total', e.target.value)} required={isRequired} /></td>
        <td className="p-2"><input className={`${inputClass} bg-stone-200 cursor-not-allowed font-bold text-center`} type="text" placeholder="%" value={data.percentage} readOnly /></td>
        <td className="p-2">
          <label className="flex items-center justify-center bg-white border border-[#8c7071] p-2 rounded cursor-pointer hover:bg-[#570013] hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleQualChange(level, 'file', e.target.files ? e.target.files[0] : null)} required={isRequired} />
          </label>
        </td>
      </tr>
    );
  };

  // Helper for generating mobile cards
  const renderMobileCard = (level: QualLevel, label: string, isRequired: boolean) => {
    const data = qualifications[level];
    return (
      <div className="bg-[#f0ede8] p-5 rounded-xl border border-white/50 space-y-4 shadow-sm">
        <h4 className="font-['Public_Sans'] font-bold text-[#570013] border-b border-[#8c707133] pb-2 mb-4">
          {level === 'other' ? <input className={inputClass} placeholder="Other Qualification (Optional)" value={data.name} onChange={(e) => handleQualChange(level, 'name', e.target.value)} /> : <>{label} {isRequired && <span className="text-[#ba1a1a]">*</span>}</>}
        </h4>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Board/University</label>
            {level === 'tenth' ? (
              <select className={`${inputClass} appearance-none`} value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired}>
                <option value="">Select Board</option><option value="CBSE">CBSE</option><option value="ICSE">ICSE</option><option value="State Board">State Board</option>
              </select>
            ) : (
              <input className={inputClass} type="text" value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired} />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Passing Year</label><input className={inputClass} type="text" maxLength={4} value={data.year} onChange={(e) => handleQualChange(level, 'year', e.target.value)} required={isRequired} /></div>
            <div><label className={labelClass}>Roll Number</label><input className={inputClass} type="text" value={data.roll} onChange={(e) => handleQualChange(level, 'roll', e.target.value)} required={isRequired} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelClass}>Obtained</label><input className={inputClass} type="number" value={data.marks} onChange={(e) => handleQualChange(level, 'marks', e.target.value)} required={isRequired} /></div>
            <div><label className={labelClass}>Total</label><input className={inputClass} type="number" value={data.total} onChange={(e) => handleQualChange(level, 'total', e.target.value)} required={isRequired} /></div>
            <div><label className={labelClass}>Percent</label><input className={`${inputClass} bg-stone-200 cursor-not-allowed font-bold text-center px-1`} type="text" value={data.percentage} readOnly placeholder="%" /></div>
          </div>
          <div className="pt-2">
            <label className="flex items-center justify-center gap-2 bg-white border border-[#8c7071] p-3 rounded cursor-pointer hover:bg-[#570013] hover:text-white transition-colors text-sm font-semibold">
              <span className="material-symbols-outlined text-lg">upload_file</span> Upload PDF Document (Max 2MB)
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleQualChange(level, 'file', e.target.files ? e.target.files[0] : null)}
                required={isRequired}
              />            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">

      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      <div className="md:hidden flex-grow pt-20 px-4 pb-32 max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#fed488] text-[#775a19] text-[10px] font-bold tracking-widest uppercase mb-3 rounded-sm">Step 03 / Documents</div>
          <h2 className="text-3xl font-['Public_Sans'] font-extrabold text-[#570013] tracking-tight leading-none mb-2">Media & Credentials</h2>
          <div className="h-1 w-12 bg-[#775a19] rounded-full"></div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>

          {/* MEDIA UPLOADS */}
          <section className="space-y-6">
            <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013] border-l-4 border-[#775a19] pl-3">Media Uploads</h3>
            <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1c1c19] block">Recent Photograph <span className="text-[#ba1a1a]">*</span></label>
                <label className="w-full h-48 bg-[#ebe8e3] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#8c7071]/50 cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-[#570013] mb-2">add_a_photo</span>
                  <span className="text-xs font-bold text-[#570013] uppercase tracking-wider bg-white px-3 py-1 rounded shadow-sm">Choose File</span>
                  <input type="file" accept="image/jpeg, image/png" className="hidden" required />
                </label>
                <div className="text-[10px] text-[#584141] uppercase tracking-wider space-y-1">
                  <p>• Only JPG, JPEG, PNG</p>
                  <p>• File size &lt; 500 KB</p>
                  <p>• Dims: 132x170px to 160x204px</p>
                </div>
              </div>

              <hr className="border-[#8c707133]" />

              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1c1c19] block">Signature <span className="text-[#ba1a1a]">*</span></label>
                <div className="bg-[#fed488]/30 border-l-2 border-[#775a19] p-2 mb-2 rounded-r">
                  <p className="text-[10px] text-[#775a19] font-bold uppercase tracking-wider">Warning: Signature must not be in block/capital letters.</p>
                </div>
                <label className="w-full h-32 bg-[#ebe8e3] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#8c7071]/50 cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-[#570013] mb-2">draw</span>
                  <span className="text-xs font-bold text-[#570013] uppercase tracking-wider bg-white px-3 py-1 rounded shadow-sm">Choose File</span>
                  <input type="file" accept="image/jpeg, image/png" className="hidden" required />
                </label>
                <div className="text-[10px] text-[#584141] uppercase tracking-wider space-y-1">
                  <p>• Only JPG, JPEG, PNG</p>
                  <p>• File size &lt; 500 KB</p>
                  <p>• Dims: 132x57px to 160x68px</p>
                </div>
              </div>
            </div>
          </section>

          {/* ACADEMIC CREDENTIALS */}
          <section className="space-y-6">
            <h3 className="text-xl font-['Public_Sans'] font-bold text-[#570013] border-l-4 border-[#775a19] pl-3">Educational Qualifications</h3>
            <div className="bg-[#570013] p-4 rounded-xl text-white shadow-md">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#fed488]">info</span>
                <p className="text-xs leading-relaxed opacity-90">In case of CGPA, please upload the calculation formula document along with your original marksheet/certificate merged into a single PDF.</p>
              </div>
            </div>

            <div className="space-y-6">
              {renderMobileCard('tenth', '10th / Matriculation', true)}
              {renderMobileCard('twelfth', '12th OR Equivalent', true)}
              {renderMobileCard('grad', 'Graduation OR Equivalent', true)}
              {renderMobileCard('other', '', false)}
            </div>
          </section>

          <button type="submit" className="w-full bg-[#570013] text-white py-5 rounded-xl font-bold tracking-widest shadow-xl flex items-center justify-center gap-3">
            SAVE &amp; PREVIEW <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
        <Footer />
      </div>

      {/* ══ DESKTOP LAYOUT ═══════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-grow">
        <main className="flex-grow flex w-full max-w-7xl mx-auto px-8 py-12">
          <SideNavBar activePath="/documents" />

          <div className="flex-1 overflow-x-hidden">
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
              <h1 className="font-['Public_Sans'] text-[3.5rem] leading-none font-extrabold tracking-tighter text-[#570013]">Document Uploads</h1>
              <div className="h-1 w-24 bg-[#775a19] mt-6"></div>
            </header>

            <form className="space-y-16" onSubmit={handleSubmit}>

              {/* 1. MEDIA UPLOADS SECTION */}
              <section className="grid grid-cols-[1fr_2.5fr] gap-12">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#570013] mb-4">Media Uploads</h3>
                    <p className="text-[#584141] leading-relaxed text-sm">Please adhere strictly to the file dimensions and size limits to prevent system rejection.</p>
                  </div>
                </div>

                <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50 flex gap-12">

                  {/* Photo Upload */}
                  <div className="flex-1 space-y-4">
                    <label className="font-['Inter'] font-semibold text-lg text-[#1c1c19] flex justify-between items-center">
                      Recent Photograph <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <label className="h-64 bg-[#ebe8e3] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-[#8c7071]/50 cursor-pointer hover:bg-white hover:border-[#570013] transition-all group">
                      <span className="material-symbols-outlined text-5xl text-[#570013] mb-4 group-hover:scale-110 transition-transform">add_a_photo</span>
                      <span className="text-sm font-bold text-[#570013] uppercase tracking-wider bg-white px-6 py-2 rounded-full shadow-sm border border-[#e5e2dd]">Choose File</span>
                      <input type="file" accept="image/jpeg, image/png" className="hidden" required />
                    </label>
                    <div className="bg-[#ebe8e3] p-4 rounded-lg">
                      <ul className="text-xs text-[#584141] font-medium uppercase tracking-wider space-y-2">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#775a19]">check_circle</span> Allow only JPG, JPEG, PNG</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#775a19]">check_circle</span> Size: Less than 500 KB</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#775a19]">check_circle</span> Dims: 132x170px to 160x204px</li>
                      </ul>
                    </div>
                  </div>

                  {/* Signature Upload */}
                  <div className="flex-1 space-y-4">
                    <label className="font-['Inter'] font-semibold text-lg text-[#1c1c19] flex justify-between items-center">
                      Digital Signature <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <label className="h-40 bg-[#ebe8e3] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-[#8c7071]/50 cursor-pointer hover:bg-white hover:border-[#570013] transition-all group">
                      <span className="material-symbols-outlined text-4xl text-[#570013] mb-3 group-hover:scale-110 transition-transform">draw</span>
                      <span className="text-sm font-bold text-[#570013] uppercase tracking-wider bg-white px-6 py-2 rounded-full shadow-sm border border-[#e5e2dd]">Choose File</span>
                      <input type="file" accept="image/jpeg, image/png" className="hidden" required />
                    </label>
                    <div className="bg-[#fed488]/20 border border-[#fed488] p-3 rounded-lg flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#775a19] text-base mt-0.5">warning</span>
                      <p className="text-xs text-[#775a19] font-bold uppercase tracking-wider">Warning: Signature must not be in capital letters.</p>
                    </div>
                    <div className="bg-[#ebe8e3] p-4 rounded-lg">
                      <ul className="text-xs text-[#584141] font-medium uppercase tracking-wider space-y-2">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#775a19]">check_circle</span> Allow only JPG, JPEG, PNG</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#775a19]">check_circle</span> Size: Less than 500 KB</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#775a19]">check_circle</span> Dims: 132x57px to 160x68px</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </section>

              {/* 2. ACADEMIC CREDENTIALS TABLE */}
              <section className="space-y-6">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h3 className="font-['Public_Sans'] text-2xl font-bold text-[#570013] mb-2">Educational Qualifications Details</h3>
                    <p className="text-[#584141] text-sm font-medium">Please ensure PDF files are under 2MB. Percentages auto-calculate.</p>
                  </div>
                  <div className="bg-[#570013] p-4 rounded-xl text-white shadow-md max-w-md">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fed488]">info</span>
                      <p className="text-[11px] leading-relaxed uppercase tracking-wider font-semibold opacity-90">In case of CGPA, please upload calculation formula along with marksheet.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-[#e5e2dd] border-b-2 border-[#8c7071]">
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013] w-[18%]">Qualification</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013] w-[20%]">Board/University</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013]">Passing Yr</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013]">Roll No.</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013] w-[10%]">Obtained</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013] w-[10%]">Total</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013] w-[10%]">Percentage</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#570013]">Upload (PDF)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8c707133]">
                      {renderTableRow('tenth', '10th / Equivalent', true)}
                      {renderTableRow('twelfth', '12th OR Equivalent', true)}
                      {renderTableRow('grad', 'Graduation OR Equivalent', true)}
                      {renderTableRow('other', '', false)}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SUBMIT */}
              <div className="pt-6 border-t border-[#8c707133] flex justify-end">
                <button className="bg-[#570013] text-white py-5 px-10 rounded-lg font-['Public_Sans'] font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#800020] transition-all flex items-center justify-center gap-3 group" type="submit">
                  Save &amp; Preview <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
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

export default DocumentsPage;