import React from 'react';

export const BiblicalBookGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div 
          key={i} 
          className="flex flex-col bg-white rounded-2xl border border-[#e9e1df] overflow-hidden shadow-sm h-full animate-pulse"
        >
          {/* Cover Placeholder */}
          <div className="relative aspect-[3/4] w-full bg-[#f0e8e6]"></div>
          
          {/* Content Placeholder */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="h-6 bg-[#f0e8e6] rounded-md w-3/4 mb-2"></div>
            <div className="h-5 bg-[#f0e8e6] rounded-md w-1/2 mb-4"></div>
            
            <div className="mt-auto space-y-2">
              <div className="h-3 bg-[#f0e8e6] rounded-md w-1/3"></div>
              <div className="h-3 bg-[#f0e8e6] rounded-md w-2/5"></div>
            </div>
            
            <div className="mt-4 h-10 w-full bg-[#f0e8e6] rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
