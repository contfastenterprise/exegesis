import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-[#e9e1df] rounded-xl ${className}`} />
  );
};

export const AppSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f6]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-[#fff8f6]/95 border-b border-[#e9e1df] px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      </header>

      {/* Main Content Skeleton (Hero + Grid) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Hero Section */}
        <div className="w-full h-[60vh] sm:h-[70vh] rounded-[2rem] overflow-hidden relative">
          <Skeleton className="w-full h-full rounded-[2rem]" />
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <Skeleton className="w-full h-64 rounded-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Skeleton className="w-full h-48 rounded-3xl" />
              <Skeleton className="w-full h-48 rounded-3xl" />
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <Skeleton className="w-full h-full min-h-[300px] rounded-3xl" />
          </div>
        </div>
      </main>
    </div>
  );
};
