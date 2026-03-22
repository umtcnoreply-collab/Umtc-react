import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SideNavBar from '../components/SideNavBar';
import { useAuth } from '../store/useAuth';
import { apiConfig, getFullUrl } from '../config/apiConfig';
type QualLevel = 'tenth' | 'twelfth' | 'grad' | 'other';
type QualField = 'name' | 'board' | 'year' | 'roll' | 'marks' | 'total' | 'percentage' | 'file';

function DocumentsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Reusable styling classes
  const inputClass = "w-full bg-[#e8f4ff] p-3 border-b-2 border-[#32467033] focus:border-[#324670] focus:outline-none transition-colors text-sm placeholder:text-stone-400";
  const labelClass = "font-['Inter'] font-medium text-sm text-[#1c1c19] mb-1 block";

  // State for Media Uploads
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for Academic Qualifications
  const [qualifications, setQualifications] = useState({
  tenth: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
  twelfth: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
  grad: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
  other: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null }
});

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
          return;
        }

        const data = await res.json();
        console.log('Fetched documents data for editing:', data);

        // Check if application is already submitted
        if (data.applicationStatus === 'Submitted' || data.applicationStatus === 'Approved' || data.applicationStatus === 'Rejected') {
          console.log('Application already submitted, redirecting to profile');
          navigate('/profile', { replace: true });
          return;
        }

        // Pre-fill photo and signature from URLs
        if (data.documents?.photoUrl) {
          // Fetch the image and convert to preview
          const photoRes = await fetch(getFullUrl(data.documents.photoUrl));
          const photoBlob = await photoRes.blob();
          const photoFile = new File([photoBlob], 'photo.png', { type: 'image/png' });
          setPhoto(photoFile);
          
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
          };
          reader.readAsDataURL(photoBlob);
        }

        if (data.documents?.signatureUrl) {
          // Fetch the image and convert to preview
          const sigRes = await fetch(getFullUrl(data.documents.signatureUrl));
          const sigBlob = await sigRes.blob();
          const sigFile = new File([sigBlob], 'signature.png', { type: 'image/png' });
          setSignature(sigFile);
          
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setSignaturePreview(reader.result as string);
          };
          reader.readAsDataURL(sigBlob);
        }

        // Pre-fill qualifications
        if (data.qualifications) {
          const qualData: any = {
            tenth: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
            twelfth: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
            grad: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null },
            other: { name: '', board: '', year: '', roll: '', marks: '', total: '', percentage: '', file: null }
          };

          Object.keys(data.qualifications).forEach((level: string) => {
            const qual = data.qualifications[level];
            if (qual && Object.keys(qual).length > 0) {
              // Log what we're receiving for debugging
              console.log(`Qualification ${level} data:`, qual);
              
              // Extract filename from URL (remove system-generated timestamp prefix)
              let fileName = 'document.pdf';
              if (qual.fileUrl) {
                const urlParts = qual.fileUrl.split('/');
                const fileNameWithTimestamp = urlParts[urlParts.length - 1];
                // Remove timestamp prefix (format: timestamp-actualFilename)
                const match = fileNameWithTimestamp.match(/\d+-(.+)$/);
                fileName = match ? match[1] : fileNameWithTimestamp;
              }

              qualData[level as QualLevel] = {
                name: qual.name || qual.schoolName || qual.collegeName || '',
                board: qual.boardOrUniversity || qual.board || qual.institution || '',
                year: qual.year || qual.passingYear || qual.yearOfPassing || '',
                roll: qual.roll || qual.rollNo || qual.rollNumber || '',
                marks: qual.marks || qual.marksObtained || '',
                total: qual.total || qual.totalMarks || qual.maxMarks || '',
                percentage: qual.percentage || '',
                file: qual.fileUrl ? { name: fileName, url: qual.fileUrl } : null
              };
            }
          });

          setQualifications(qualData);
        }
      } catch (err) {
        console.error('Error fetching application data:', err);
      }
    };

    if (token) {
      fetchApplicationData();
    }
  }, [token, navigate]);
  
  // Handle photo upload with preview
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle signature upload with preview
  const handleSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignature(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear photo and preview
  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Clear signature and preview
  const clearSignature = () => {
    setSignature(null);
    setSignaturePreview(null);
  };

  // Truncate filename to 8 characters
  const truncateFileName = (name: string) => {
    if (name.length <= 8) return name;
    const dot = name.lastIndexOf('.');
    if (dot === -1) return name.substring(0, 8);
    const extension = name.substring(dot);
    const maxNameLength = 8 - extension.length;
    return name.substring(0, maxNameLength) + extension;
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required files
      if (!photo) {
        setError('Please upload a photograph');
        setLoading(false);
        return;
      }
      if (!signature) {
        setError('Please upload a signature');
        setLoading(false);
        return;
      }

      // Create FormData for file uploads
      const formData = new FormData();

      // Append media files
      formData.append('photo', photo);
      formData.append('signature', signature);

      // Append qualifications data
      Object.entries(qualifications).forEach(([level, data]) => {
        if (data.file || data.name || data.board) {
          // Only add if there's file or data
          formData.append(`qualifications[${level}][name]`, data.name);
          formData.append(`qualifications[${level}][board]`, data.board);
          formData.append(`qualifications[${level}][year]`, data.year);
          formData.append(`qualifications[${level}][roll]`, data.roll);
          formData.append(`qualifications[${level}][marks]`, data.marks);
          formData.append(`qualifications[${level}][total]`, data.total);
          formData.append(`qualifications[${level}][percentage]`, data.percentage);
          if (data.file) {
            formData.append(`qualifications[${level}][file]`, data.file);
          }
        }
      });

      console.log('Uploading documents...');
      console.log('Token:', token);

      const res = await fetch(apiConfig.application.uploadDocuments, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('FormData:', formData);

      // Handle response
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
        setError(data.message || `Failed to upload documents (${res.status})`);
        setLoading(false);
        return;
      }

      console.log('Documents uploaded successfully:', data);
      // Navigate to preview page on success
      navigate('/preview');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while uploading documents');
      setLoading(false);
    }
  };

  // Helper for generating table rows (Desktop)
  const renderTableRow = (level: QualLevel, label: string, isRequired: boolean) => {
    const data = qualifications[level];
    return (
      <tr className="border-b border-[#32467033] hover:bg-[#e5e2dd]/30 transition-colors">
        <td className="p-3 font-semibold text-sm text-[#324670] whitespace-nowrap">
          {level === 'other' ? (
            <input className={inputClass} placeholder="Other (Optional)" value={data.name} onChange={(e) => handleQualChange(level, 'name', e.target.value)} />
          ) : (
            <>{label} {isRequired && <span className="text-[#c80000]">*</span>}</>
          )}
        </td>
        <td className="p-2">
          {level === 'tenth' || level === 'twelfth' ? (
            <select className={`${inputClass} appearance-none`} value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired}>
              <option value="">Select {level === 'tenth' ? 'Board' : 'University'}</option>
              {level === 'tenth' ? (
                <>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </>
              ) : (
                <>
                  <option value="Delhi University">Delhi University</option>
                  <option value="JNU">JNU</option>
                  <option value="Other Universities">Other Universities</option>
                </>
              )}
            </select>
          ) : (
            <input className={inputClass} type="text" placeholder="Institution/Board" value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired} />
          )}
        </td>
        <td className="p-2 w-[17%]"><input className={inputClass} type="text" placeholder="YYYY" maxLength={4} value={data.year} onChange={(e) => handleQualChange(level, 'year', e.target.value)} required={isRequired} /></td>
        <td className="p-2 w-[15%]"><input className={inputClass} type="text" placeholder="Roll No" value={data.roll} onChange={(e) => handleQualChange(level, 'roll', e.target.value)} required={isRequired} /></td>
        <td className="p-2 w-[11%]"><input className={inputClass} type="number" placeholder="0" value={data.marks} onChange={(e) => handleQualChange(level, 'marks', e.target.value)} required={isRequired} /></td>
        <td className="p-2 w-[11%]"><input className={inputClass} type="number" placeholder="0" value={data.total} onChange={(e) => handleQualChange(level, 'total', e.target.value)} required={isRequired} /></td>
        <td className="p-2 w-[11%]"><input className={`${inputClass} bg-stone-200 cursor-not-allowed font-bold text-center`} type="text" placeholder="%" value={data.percentage} readOnly /></td>
        <td className="p-2 w-[14%]" style={{minWidth: '110px'}}>
          {data.file ? (
            <div className="flex items-center justify-between bg-[#324670]/10 border border-[#324670] p-2 rounded gap-2">
              <span className="text-xs font-semibold text-[#324670] truncate flex items-center gap-1" title={typeof data.file === 'object' && 'name' in data.file ? (data.file as any).name : (data.file as File).name || 'uploaded'}>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {typeof data.file === 'object' && 'name' in data.file ? truncateFileName((data.file as any).name) : truncateFileName((data.file as File).name)}
              </span>
              <button
                type="button"
                onClick={() => handleQualChange(level, 'file', null)}
                className="p-1 hover:bg-[#c80000] hover:text-white rounded transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center bg-white border border-[#324670] p-2 rounded cursor-pointer hover:bg-[#324670] hover:text-white transition-colors group">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleQualChange(level, 'file', e.target.files ? e.target.files[0] : null)} required={isRequired} />
            </label>
          )}
        </td>
      </tr>
    );
  };

  // Helper for generating mobile cards
  const renderMobileCard = (level: QualLevel, label: string, isRequired: boolean) => {
    const data = qualifications[level];
    return (
      <div className="bg-[#f0ede8] p-5 rounded-xl border border-white/50 space-y-4 shadow-sm">
        <h4 className="font-['Public_Sans'] font-bold text-[#324670] border-b border-[#32467033] pb-2 mb-4">
          {level === 'other' ? <input className={inputClass} placeholder="Other Qualification (Optional)" value={data.name} onChange={(e) => handleQualChange(level, 'name', e.target.value)} /> : <>{label} {isRequired && <span className="text-[#c80000]">*</span>}</>}
        </h4>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Board/University</label>
            {level === 'tenth' || level === 'twelfth' ? (
              <select className={`${inputClass} appearance-none`} value={data.board} onChange={(e) => handleQualChange(level, 'board', e.target.value)} required={isRequired}>
                <option value="">Select {level === 'tenth' ? 'Board' : 'University'}</option>
                {level === 'tenth' ? (
                  <>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                  </>
                ) : (
                  <>
                    <option value="Delhi University">Delhi University</option>
                    <option value="JNU">JNU</option>
                    <option value="Other Universities">Other Universities</option>
                  </>
                )}
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
            {data.file ? (
              <div className="flex items-center justify-between bg-[#324670]/10 border border-[#324670] p-3 rounded">
                <span className="text-sm font-semibold text-[#324670] truncate flex items-center gap-2" title={typeof data.file === 'object' && 'name' in data.file ? (data.file as any).name : (data.file as File).name || 'uploaded'}>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  {typeof data.file === 'object' && 'name' in data.file ? truncateFileName((data.file as any).name) : truncateFileName((data.file as File).name)}
                </span>
                <button
                  type="button"
                  onClick={() => handleQualChange(level, 'file', null)}
                  className="p-1.5 hover:bg-[#c80000] hover:text-white rounded transition-colors flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 bg-white border border-[#324670] p-3 rounded cursor-pointer hover:bg-[#324670] hover:text-white transition-colors text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">upload_file</span> Upload PDF Document (Max 2MB)
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleQualChange(level, 'file', e.target.files ? e.target.files[0] : null)}
                  required={isRequired}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f0f8ff] text-[#1c1c19] font-['Inter'] min-h-screen flex flex-col">

      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      <div className="md:hidden flex-grow pt-20 px-4 pb-32 max-w-md mx-auto w-full">
        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#fed488] text-[#EC5A3B] text-[10px] font-bold tracking-widest uppercase mb-3 rounded-sm">Step 03 / Documents</div>
          <h2 className="text-3xl font-['Public_Sans'] font-extrabold text-[#324670] tracking-tight leading-none mb-2">Media & Credentials</h2>
          <div className="h-1 w-12 bg-[#EC5A3B] rounded-full"></div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>

          {/* MEDIA UPLOADS */}
          <section className="space-y-6">
            <h3 className="text-xl font-['Public_Sans'] font-bold text-[#324670] border-l-4 border-[#EC5A3B] pl-3">Media Uploads</h3>
            <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1c1c19] block">Recent Photograph <span className="text-[#c80000]">*</span></label>
                {photoPreview ? (
                  <div className="w-full relative">
                    <img src={photoPreview} alt="Photo Preview" className="w-full h-48 object-cover rounded-lg border-2 border-[#324670]" />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="absolute top-2 right-2 bg-[#c80000] text-white p-2 rounded-full hover:bg-[#d32f2f] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-48 bg-[#e8f4ff] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#324670]/50 cursor-pointer hover:border-[#324670] transition-colors">
                    <span className="material-symbols-outlined text-3xl text-[#324670] mb-2">add_a_photo</span>
                    <span className="text-xs font-bold text-[#324670] uppercase tracking-wider bg-white px-3 py-1 rounded shadow-sm">Choose File</span>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png" 
                      className="hidden" 
                      required 
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
                <div className="text-[10px] text-[#324670] uppercase tracking-wider space-y-1">
                  <p>• Only JPG, JPEG, PNG</p>
                  <p>• File size &lt; 500 KB</p>
                  <p>• Dims: 132x170px to 160x204px</p>
                </div>
              </div>

              <hr className="border-[#32467033]" />

              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1c1c19] block">Signature <span className="text-[#c80000]">*</span></label>
                <div className="bg-[#fed488]/30 border-l-2 border-[#EC5A3B] p-2 mb-2 rounded-r">
                  <p className="text-[10px] text-[#EC5A3B] font-bold uppercase tracking-wider">Warning: Signature must not be in block/capital letters.</p>
                </div>
                {signaturePreview ? (
                  <div className="w-full relative">
                    <img src={signaturePreview} alt="Signature Preview" className="w-full h-32 object-cover rounded-lg border-2 border-[#324670]" />
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="absolute top-2 right-2 bg-[#c80000] text-white p-2 rounded-full hover:bg-[#d32f2f] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-32 bg-[#e8f4ff] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#324670]/50 cursor-pointer hover:border-[#324670] transition-colors">
                    <span className="material-symbols-outlined text-3xl text-[#324670] mb-2">draw</span>
                    <span className="text-xs font-bold text-[#324670] uppercase tracking-wider bg-white px-3 py-1 rounded shadow-sm">Choose File</span>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png" 
                      className="hidden" 
                      required 
                      onChange={handleSignatureChange}
                    />
                  </label>
                )}
                <div className="text-[10px] text-[#324670] uppercase tracking-wider space-y-1">
                  <p>• Only JPG, JPEG, PNG</p>
                  <p>• File size &lt; 500 KB</p>
                  <p>• Dims: 132x57px to 160x68px</p>
                </div>
              </div>
            </div>
          </section>

          {/* ACADEMIC CREDENTIALS */}
          <section className="space-y-6">
            <h3 className="text-xl font-['Public_Sans'] font-bold text-[#324670] border-l-4 border-[#EC5A3B] pl-3">Educational Qualifications</h3>
            <div className="bg-[#324670] p-4 rounded-xl text-white shadow-md">
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#324670] text-white py-5 rounded-xl font-bold tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'UPLOADING...' : 'SAVE & PREVIEW'}
            {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
          {error && (
            <div className="w-full bg-[#ffebee] border border-[#c80000] text-[#c80000] p-4 rounded-lg text-sm font-semibold">
              {error}
            </div>
          )}
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
                {/* Background line - unfilled */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#e8f4ff] -z-10"></div>
                {/* Filled progress line - 66.66% for step 3 */}
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-[#EC5A3B] -z-10 transition-all duration-500"
                  style={{ width: '66.66%' }}
                ></div>
                
                {/* Step 1: Registration */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EC5A3B] text-white flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Registration</span>
                </div>
                
                {/* Step 2: Basic Details */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EC5A3B] text-white flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-sm">check</span></div>
                  <span className="text-xs font-['Inter'] text-stone-500">Basic Details</span>
                </div>
                
                {/* Step 3: Documents (Current) */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#324670] text-white flex items-center justify-center font-bold shadow-md">3</div>
                  <span className="text-sm font-['Inter'] text-[#324670] font-semibold">Documents</span>
                </div>
                
                {/* Step 4: Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e8f4ff] text-stone-400 flex items-center justify-center font-bold shadow-md">4</div>
                  <span className="text-xs font-['Inter'] text-stone-500">Preview</span>
                </div>
              </div>
            </div>
            <header className="mb-16">
              <h1 className="font-['Public_Sans'] text-[3.5rem] leading-none font-extrabold tracking-tighter text-[#324670]">Document Uploads</h1>
              <div className="h-1 w-24 bg-[#EC5A3B] mt-6"></div>
            </header>

            <form className="space-y-16" onSubmit={handleSubmit}>

              {/* 1. MEDIA UPLOADS SECTION */}
              <section className="grid grid-cols-[1fr_2.5fr] gap-12">
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <h3 className="font-['Public_Sans'] text-xl font-bold text-[#324670] mb-4">Media Uploads</h3>
                    <p className="text-[#324670] leading-relaxed text-sm">Please adhere strictly to the file dimensions and size limits to prevent system rejection.</p>
                  </div>
                </div>

                <div className="bg-[#f0ede8] p-10 rounded-2xl shadow-sm border border-white/50 flex gap-12">

                  {/* Photo Upload */}
                  <div className="flex-1 space-y-4">
                    <label className="font-['Inter'] font-semibold text-lg text-[#1c1c19] flex justify-between items-center">
                      Recent Photograph <span className="text-[#c80000]">*</span>
                    </label>
                    {photoPreview ? (
                      <div className="h-64 bg-white rounded-xl border-2 border-[#324670] overflow-hidden relative group">
                        <img src={photoPreview} alt="Photo Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={clearPhoto}
                          className="absolute top-3 right-3 bg-[#c80000] text-white p-2 rounded-full hover:bg-[#d32f2f] transition-colors shadow-lg"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    ) : (
                      <label className="h-64 bg-[#e8f4ff] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-[#324670]/50 cursor-pointer hover:bg-white hover:border-[#324670] transition-all group">
                        <span className="material-symbols-outlined text-5xl text-[#324670] mb-4 group-hover:scale-110 transition-transform">add_a_photo</span>
                        <span className="text-sm font-bold text-[#324670] uppercase tracking-wider bg-white px-6 py-2 rounded-full shadow-sm border border-[#e5e2dd]">Choose File</span>
                        <input 
                          type="file" 
                          accept="image/jpeg, image/png" 
                          className="hidden" 
                          required 
                          onChange={handlePhotoChange}
                        />
                      </label>
                    )}
                    <div className="bg-[#e8f4ff] p-4 rounded-lg">
                      <ul className="text-xs text-[#324670] font-medium uppercase tracking-wider space-y-2">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#EC5A3B]">check_circle</span> Allow only JPG, JPEG, PNG</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#EC5A3B]">check_circle</span> Size: Less than 500 KB</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#EC5A3B]">check_circle</span> Dims: 132x170px to 160x204px</li>
                      </ul>
                    </div>
                  </div>

                  {/* Signature Upload */}
                  <div className="flex-1 space-y-4">
                    <label className="font-['Inter'] font-semibold text-lg text-[#1c1c19] flex justify-between items-center">
                      Digital Signature <span className="text-[#c80000]">*</span>
                    </label>
                    {signaturePreview ? (
                      <div className="h-40 bg-white rounded-xl border-2 border-[#324670] overflow-hidden relative group">
                        <img src={signaturePreview} alt="Signature Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="absolute top-3 right-3 bg-[#c80000] text-white p-2 rounded-full hover:bg-[#d32f2f] transition-colors shadow-lg"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    ) : (
                      <label className="h-40 bg-[#e8f4ff] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-[#324670]/50 cursor-pointer hover:bg-white hover:border-[#324670] transition-all group">
                        <span className="material-symbols-outlined text-4xl text-[#324670] mb-3 group-hover:scale-110 transition-transform">draw</span>
                        <span className="text-sm font-bold text-[#324670] uppercase tracking-wider bg-white px-6 py-2 rounded-full shadow-sm border border-[#e5e2dd]">Choose File</span>
                        <input 
                          type="file" 
                          accept="image/jpeg, image/png" 
                          className="hidden" 
                          required 
                          onChange={handleSignatureChange}
                        />
                      </label>
                    )}
                    <div className="bg-[#fed488]/20 border border-[#fed488] p-3 rounded-lg flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#EC5A3B] text-base mt-0.5">warning</span>
                      <p className="text-xs text-[#EC5A3B] font-bold uppercase tracking-wider">Warning: Signature must not be in capital letters.</p>
                    </div>
                    <div className="bg-[#e8f4ff] p-4 rounded-lg">
                      <ul className="text-xs text-[#324670] font-medium uppercase tracking-wider space-y-2">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#EC5A3B]">check_circle</span> Allow only JPG, JPEG, PNG</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#EC5A3B]">check_circle</span> Size: Less than 500 KB</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-[#EC5A3B]">check_circle</span> Dims: 132x57px to 160x68px</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </section>

              {/* 2. ACADEMIC CREDENTIALS TABLE */}
              <section className="space-y-6">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h3 className="font-['Public_Sans'] text-2xl font-bold text-[#324670] mb-2">Educational Qualifications Details</h3>
                    <p className="text-[#324670] text-sm font-medium">Please ensure PDF files are under 2MB. Percentages auto-calculate.</p>
                  </div>
                  <div className="bg-[#324670] p-4 rounded-xl text-white shadow-md max-w-md">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fed488]">info</span>
                      <p className="text-[11px] leading-relaxed uppercase tracking-wider font-semibold opacity-90">In case of CGPA, please upload calculation formula along with marksheet.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f0ede8] p-6 rounded-2xl shadow-sm border border-white/50 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-[#e5e2dd] border-b-2 border-[#324670]">
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[17%]">Qualification</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[20%]">Board/University</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[17%]">Passing Yr</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[15%]">Roll No.</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[11%]">Obtained</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[11%]">Total</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670] w-[11%]">Percentage</th>
                        <th className="p-3 font-bold text-xs uppercase tracking-wider text-[#324670]">Upload (PDF)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#32467033]">
                      {renderTableRow('tenth', '10th / Equivalent', true)}
                      {renderTableRow('twelfth', '12th OR Equivalent', true)}
                      {renderTableRow('grad', 'Graduation OR Equivalent', true)}
                      {renderTableRow('other', '', false)}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SUBMIT */}
              <div className="pt-6 border-t border-[#32467033] flex justify-end gap-4 flex-col">
                {error && (
                  <div className="w-full bg-[#ffebee] border border-[#c80000] text-[#c80000] p-4 rounded-lg text-sm font-semibold">
                    {error}
                  </div>
                )}
                <button 
                  className="bg-[#324670] text-white py-5 px-10 rounded-lg font-['Public_Sans'] font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#800020] transition-all flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'UPLOADING...' : 'Save & Preview'}
                  {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
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
