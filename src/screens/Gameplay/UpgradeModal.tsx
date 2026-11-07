import { ArrowUp, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { getVehicleById } from '../../game/config/vehicles';
import { UpgradeDefinition } from '../../game/config/upgrades';
import { gameEvents } from '../../game/systems/GameEvents';
import { audioSystem } from '../../game/systems/AudioSystem';
import { UpgradeIcon } from '../../components/GameIcon/UpgradeIcon';

function getCardStyleByIndex(idx: number) {
  if (idx === 0) {
    // Purple Neon Card (like Klakson Sonic in Panel 4)
    return {
      border: 'border-[#E879F9]',
      bg: 'radial-gradient(circle at 50% 28%, rgba(168, 85, 247, 0.42) 0%, rgba(59, 7, 100, 0.88) 55%, rgba(24, 12, 48, 0.96) 100%)',
      shadow:
        '0 0 24px rgba(192, 132, 252, 0.65), inset 0 0 18px rgba(192, 132, 252, 0.35)',
    };
  }
  if (idx === 1) {
    // Cyan-Blue Neon Card (like Double Shot in Panel 4)
    return {
      border: 'border-[#38BDF8]',
      bg: 'radial-gradient(circle at 50% 28%, rgba(56, 189, 248, 0.38) 0%, rgba(12, 74, 110, 0.88) 55%, rgba(10, 25, 47, 0.96) 100%)',
      shadow:
        '0 0 24px rgba(56, 189, 248, 0.65), inset 0 0 18px rgba(56, 189, 248, 0.35)',
    };
  }
  // Orange-Gold Neon Card (like Armor in Panel 4)
  return {
    border: 'border-[#FBBF24]',
    bg: 'radial-gradient(circle at 50% 28%, rgba(245, 158, 11, 0.38) 0%, rgba(120, 53, 15, 0.88) 55%, rgba(36, 18, 10, 0.96) 100%)',
    shadow:
      '0 0 24px rgba(251, 191, 36, 0.65), inset 0 0 18px rgba(251, 191, 36, 0.35)',
  };
}

export function UpgradeModal() {
  const { level, upgradeChoices } = useGameStore();
  const vehicleId = usePlayerStore((s) => s.vehicleId);
  const vehicleCfg = getVehicleById(vehicleId);

  const handleSelect = (def: UpgradeDefinition) => {
    audioSystem.playUiClick();
    gameEvents.emit('react:select-upgrade', def);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080C18]/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 select-none safe-area-pad">
      {/* Modal Frame matching Panel 4 of Reference Image (scrollable on small viewports) */}
      <div
        className="relative w-full max-w-3xl max-h-[94dvh] overflow-y-auto rounded-2xl border-2 border-slate-500/80 p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, #2A2456 0%, #141632 58%, #0D1024 100%)',
        }}
      >
        {/* Top Header: Slanted LEVEL UP! over Hazard Stripe Bar */}
        <div className="relative text-center mb-3.5 sm:mb-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-3 sm:h-4 hazard-stripes opacity-90 rounded-sm" />
            <h2
              className="relative z-10 px-4 sm:px-6 font-display font-black italic text-2xl sm:text-5xl tracking-wide uppercase arcade-title-shadow"
              style={{
                background: 'linear-gradient(180deg, #FEF9C3 0%, #FACC15 60%, #EAB308 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LEVEL UP!
            </h2>
          </div>

          {/* Lv. 6 -> 7 Row */}
          <div className="mt-1 sm:mt-2 flex items-center justify-center gap-2 sm:gap-3 font-display font-black text-xl sm:text-3xl text-white drop-shadow">
            <span>Lv. {Math.max(1, level - 1)}</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]" />
            <span className="text-[#FACC15]">{level}</span>
          </div>

          {/* Glowing Golden Flare Divider Line */}
          <div
            className="mx-auto mt-1.5 sm:mt-2 h-[2px] w-3/4"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #FACC15 50%, transparent 100%)',
              boxShadow: '0 0 12px #FACC15',
            }}
          />

          <p className="font-display font-bold text-xs sm:text-lg text-white mt-1.5 sm:mt-2.5 drop-shadow">
            Pilih 1 Upgrade
          </p>
        </div>

        {/* 3 Neon Upgrade Cards: Touch-friendly horizontal list on Mobile (< sm), 3-column vertical cards on Tablet/Desktop (sm:) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {upgradeChoices.map((choice, idx) => {
            const { definition, currentLevel, nextLevel } = choice;
            const style = getCardStyleByIndex(idx);
            const isNew = idx === 0 || (currentLevel === 0 && definition.category === 'weapon');
            const isVehicleBasicWeapon = definition.weaponId === 'double-shot';

            return (
              <button
                key={definition.id}
                onClick={() => handleSelect(definition)}
                style={{
                  background: style.bg,
                  boxShadow: style.shadow,
                }}
                className={`group relative rounded-2xl p-3.5 sm:p-5 border-[2.5px] ${style.border} flex flex-row sm:flex-col items-center text-left sm:text-center justify-between gap-3 sm:gap-0 transition-transform duration-150 hover:-translate-y-1 active:scale-[0.98] cursor-pointer sm:min-h-[260px]`}
              >
                {/* NEW! Golden Badge overlapping top-right corner */}
                {isNew && (
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-b from-[#FEF08A] to-[#F59E0B] border border-[#78350F] text-[#0F172A] font-display font-black italic text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-md shadow-md">
                    NEW!
                  </span>
                )}

                {/* Extracted Upgrade Illustration */}
                <div className="sm:my-2 w-14 h-14 sm:w-auto sm:h-20 flex items-center justify-center shrink-0 transform group-hover:scale-110 transition-transform">
                  <UpgradeIcon
                    type={definition.iconType}
                    vehicleId={vehicleId}
                    className="w-14 h-12 sm:w-24 sm:h-16"
                  />
                </div>

                {/* Underlined Name & Description */}
                <div className="flex-1 sm:w-full">
                  {isVehicleBasicWeapon && (
                    <div className="mb-1 flex items-center justify-start sm:justify-center">
                      <span className="text-[9px] sm:text-[10px] font-display font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-sm">
                        SENJATA KHAS {vehicleCfg.name.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="font-display font-extrabold text-base sm:text-xl text-white sm:pb-1 sm:mb-1 sm:border-b sm:border-white/25">
                    {definition.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-100 leading-snug mt-0.5 sm:mt-0 sm:px-1">
                    {definition.description}
                  </p>
                  <p className="text-[11px] sm:text-xs text-amber-300 font-bold mt-1.5 sm:px-1">
                    ✦ {definition.effectText(nextLevel)}
                  </p>
                </div>

                {/* Level Up Indicator */}
                <div className="sm:mt-4 sm:pt-2.5 sm:border-t sm:border-white/15 sm:w-full flex items-center justify-center gap-1 font-display font-black text-sm sm:text-base text-[#FACC15] shrink-0">
                  <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FACC15] text-[#FACC15] stroke-[3]" />
                  <span>Lv. {nextLevel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
