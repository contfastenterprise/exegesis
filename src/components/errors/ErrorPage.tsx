import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface ErrorAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
}

interface ErrorPageProps {
  code?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
}

export function ErrorPage({
  code,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction
}: ErrorPageProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-[#e9e1df] p-10 max-w-lg w-full text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#faf2f0] rounded-full opacity-50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#faf2f0] rounded-full opacity-50 blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto bg-[#faf2f0] rounded-2xl flex items-center justify-center text-[#442a22] mb-6 shadow-sm border border-[#e9e1df]">
            {icon}
          </div>
          
          {code && (
            <div className="text-sm font-bold text-[#D4AF37] tracking-wider mb-2">
              ERROR {code}
            </div>
          )}
          
          <h1 className="font-serif text-3xl font-bold text-[#442a22] mb-4">
            {title}
          </h1>
          
          <p className="text-[#75584d] text-base mb-10 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-[#e9e1df] text-[#442a22] font-semibold hover:bg-[#fdfaf9] hover:border-[#dcd0cd] transition-all flex items-center justify-center gap-2 group"
              >
                {secondaryAction.icon || <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                {secondaryAction.label}
              </button>
            )}
            
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold hover:bg-[#321f19] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                {primaryAction.icon || <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                {primaryAction.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
