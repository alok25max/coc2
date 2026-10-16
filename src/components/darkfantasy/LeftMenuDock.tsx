import React, { useState } from 'react';
import { Mail, MessageSquare, Shield, X, Award, CheckCircle2, Trophy } from 'lucide-react';
import { sound } from '../../utils/audio';

export const LeftMenuDock: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'mail' | 'chat' | 'defense' | null>(null);

  const openModal = (modal: 'mail' | 'chat' | 'defense') => {
    setActiveModal(modal);
    sound.playDeploy();
  };

  return (
    <>
      {/* Left Vertical Action Buttons */}
      <div className="flex flex-col gap-2.5 select-none">
        {/* Mail Button */}
        <button
          onClick={() => openModal('mail')}
          title="War Mail & Village Inbox"
          className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#18233b] via-[#101728] to-[#090d18] border-2 border-[#b45309] hover:border-[#f59e0b] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <Mail className="w-5 h-5 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:text-amber-200 transition-colors" />
          {/* Subtle notification dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 rounded-full border border-amber-300 flex items-center justify-center text-[8px] font-black text-white shadow">
            1
          </span>
        </button>

        {/* Clan Chat & Quests Button */}
        <button
          onClick={() => openModal('chat')}
          title="Clan Messages & Daily Quests"
          className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#18233b] via-[#101728] to-[#090d18] border-2 border-[#b45309] hover:border-[#f59e0b] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <MessageSquare className="w-5 h-5 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:text-amber-200 transition-colors" />
        </button>

        {/* Defense / War Log Button (with badge '3' matching reference) */}
        <button
          onClick={() => openModal('defense')}
          title="Defense Log & Raid Reports"
          className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#18233b] via-[#101728] to-[#090d18] border-2 border-[#b45309] hover:border-[#f59e0b] flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <Shield className="w-5 h-5 text-sky-400 fill-sky-500/30 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:text-sky-300 transition-colors" />
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-rose-600 border border-amber-300 text-[9px] font-black text-white shadow-md">
            3
          </span>
        </button>
      </div>

      {/* Popups for the Left Menu */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#131b2e] via-[#0e1526] to-[#090e1c] border-2 border-[#b45309] max-w-md w-full rounded-3xl p-5 shadow-2xl relative text-slate-200 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#523b18] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {activeModal === 'mail' ? '✉️' : activeModal === 'chat' ? '💬' : '🛡️'}
                </span>
                <h3 className="font-clash-header font-black text-base text-amber-300">
                  {activeModal === 'mail' && 'Village Mail & Royal Decrees'}
                  {activeModal === 'chat' && 'Clan Quests & War Orders'}
                  {activeModal === 'defense' && 'Defense History & Raid Logs'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
              {activeModal === 'mail' && (
                <>
                  <div className="bg-[#0b101c] p-3 rounded-xl border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span>🏰 Royal Construction Decree</span>
                      <span className="text-[10px] text-slate-400">1h ago</span>
                    </div>
                    <p className="text-slate-300">
                      Town Hall Level upgrades are active. Inspect the 12-tier architectural progression to advance your kingdom!
                    </p>
                  </div>
                  <div className="bg-[#0b101c] p-3 rounded-xl border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>💎 Clan War Victory Reward</span>
                      <span className="text-[10px] text-slate-400">1d ago</span>
                    </div>
                    <p className="text-slate-300">
                      Your fortress defended successfully against barbarian invaders. +150 Trophies and 250,000 Gold stored.
                    </p>
                  </div>
                </>
              )}

              {activeModal === 'chat' && (
                <>
                  <div className="bg-[#0b101c] p-3 rounded-xl border border-amber-500/20 space-y-2">
                    <span className="font-bold text-amber-400 block">Daily Kingdom Quests:</span>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>⚔️ Destroy 15 enemy cannons in raids</span>
                      <span className="text-amber-400 font-bold">12/15</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>🏰 Upgrade Town Hall to next tier</span>
                      <span className="text-emerald-400 font-bold">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>🧪 Brew 5 tactical combat spells</span>
                      <span className="text-emerald-400 font-bold">Completed! ✓</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'defense' && (
                <>
                  <div className="bg-[#0b101c] p-3 rounded-xl border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>🛡️ Defense Won! (+28 Trophies)</span>
                      <span className="text-[10px] text-slate-400">35m ago</span>
                    </div>
                    <p className="text-slate-300">
                      Attacker: GoblinRaider99 • 38% Damage • 0 Stars • Your cannons and mortars held strong!
                    </p>
                  </div>
                  <div className="bg-[#0b101c] p-3 rounded-xl border border-rose-500/30 space-y-1">
                    <div className="flex items-center justify-between text-rose-400 font-bold">
                      <span>⚔️ Defense Defeated (-14 Trophies)</span>
                      <span className="text-[10px] text-slate-400">3h ago</span>
                    </div>
                    <p className="text-slate-300">
                      Attacker: DragonMaster • 62% Damage • 2 Stars • Town Hall destroyed by air raid.
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
