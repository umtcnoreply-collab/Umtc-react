import React from 'react';

interface ProcessTimelineProps {
  currentStep: number; // 1, 2, 3, or 4
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ currentStep }) => {
  // Calculate mathematically accurate segments
  const getProgressWidth = (step: number): string => {
    if (step <= 1) return '0%';
    if (step === 2) return '33.33%';
    if (step === 3) return '66.66%';
    return '100%';
  };

  const getStepStatus = (step: number): 'completed' | 'current' | 'upcoming' => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const renderStep = (step: number, label: string) => {
    const status = getStepStatus(step);

    if (status === 'completed') {
      return (
        <div key={step} className="flex flex-col items-center gap-2 w-20">
          {/* mt-[2px] forces the 36px circle's center to align with the 40px circle */}
          <div className="mt-[2px] w-9 h-9 rounded-full bg-[#9fcb54] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
          <span className="text-xs font-['Inter'] text-stone-500 text-center">{label}</span>
        </div>
      );
    }

    if (status === 'current') {
      return (
        <div key={step} className="flex flex-col items-center gap-2 w-20">
          {/* 40px circle naturally centers exactly at top-[20px] */}
          <div className="w-10 h-10 rounded-full bg-[#324670] text-white flex items-center justify-center font-bold shadow-md">
            {step}
          </div>
          <span className="text-sm font-['Inter'] text-[#324670] font-semibold text-center">{label}</span>
        </div>
      );
    }

    return (
      <div key={step} className="flex flex-col items-center gap-2 w-20">
        <div className="mt-[2px] w-9 h-9 rounded-full bg-[#e8f4ff] text-stone-400 flex items-center justify-center font-bold">
          {step}
        </div>
        <span className="text-xs font-['Inter'] text-stone-500 text-center">{label}</span>
      </div>
    );
  };

  const steps = [
    { step: 1, label: 'Registration' },
    { step: 2, label: 'Basic Details' },
    { step: 3, label: 'Documents' },
    { step: 4, label: 'Preview' }
  ];

  return (
    <div className="mb-16 px-4">
      {/* Changed to items-start so text wrapping doesn't shift the circles vertically */}
      <div className="flex items-start justify-between relative z-0">
        
        {/* Line Wrapper: Constrained exactly between the centers of the 1st and 4th items */}
        <div className="absolute top-[20px] left-[40px] right-[40px] -z-10">
          {/* Background line */}
          <div className="absolute w-full h-1 bg-[#e8f4ff]"></div>
          
          {/* Dynamic Fill line */}
          <div
            className="absolute h-1 bg-[#9fcb54] transition-all duration-500"
            style={{ width: getProgressWidth(currentStep) }}
          ></div>
        </div>

        {/* Render all steps */}
        {steps.map(({ step, label }) => renderStep(step, label))}
      </div>
    </div>
  );
};

export default ProcessTimeline;