import { PricingTable } from "@clerk/nextjs";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-[#faf3e0] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold font-serif text-[#212a3b] mb-4">
            Select Your Library Access
          </h1>
          <p className="text-xl text-[#3d485e] max-w-2xl mx-auto">
            Choose the membership that suits your reading habbits. Unlock more books,
            longer voice sessions, and professional AI features.
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-xl border border-[#e5e7eb]/50 overflow-hidden">
          <PricingTable />
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#663820]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-[#212a3b] mb-3">Expansive Libraries</h3>
                <p className="text-[#3d485e]">Keep hundreds of books in your pocket with Standard and Pro plans.</p>
            </div>
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#663820]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🎙️</span>
                </div>
                <h3 className="text-xl font-bold text-[#212a3b] mb-3">Immersive Audio</h3>
                <p className="text-[#3d485e]">Engage in deeper conversations with session limits up to 60 minutes.</p>
            </div>
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#663820]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-[#212a3b] mb-3">Priority Intelligence</h3>
                <p className="text-[#3d485e]">Get faster response times and more accurate book analysis.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
