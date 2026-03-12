import { Loader2 } from "lucide-react";

export const LoadingOverlay = ({ message }: { message: string }) => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500 animate-in fade-in">
      <div className="relative">
        {/* Decorative background pulse */}
        <div className="absolute inset-0 scale-150 blur-2xl bg-[#663820]/30 rounded-full animate-pulse" />
        
        <div className="relative flex flex-col items-center space-y-6">
          <Loader2 className="h-16 w-16 text-white animate-spin stroke-[1.5px]" />
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-2xl font-bold text-white font-(family-name:--font-ibm-plex-serif) tracking-tight">
              {message}
            </h2>
            <p className="text-white/60 text-lg animate-pulse">
              Please wait while we prepare your literary masterpiece...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
