"use client";

interface PlanCardProps {
  payAsYouGo: boolean;
  onTogglePayAsYouGo: () => void;
}

export function PlanCard({ payAsYouGo, onTogglePayAsYouGo }: PlanCardProps) {
  return (
    <div className="mb-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">CURRENT PLAN</h2>
            <p className="text-lg font-medium opacity-90">Researcher</p>
          </div>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
            Manage Plan
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">API Usage</span>
              <InfoIcon />
            </div>
            <div className="text-sm mb-2">0/1,000 Credits</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: "0%" }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <span className="text-sm">Monthly plan</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Pay as you go</span>
              <button
                onClick={onTogglePayAsYouGo}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  payAsYouGo ? "bg-white" : "bg-white/30"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-pink-500 transition-transform ${
                    payAsYouGo ? "translate-x-6" : "translate-x-1"
                  }`}
                ></span>
              </button>
              <InfoIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg
      className="w-4 h-4 opacity-70 cursor-help"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
