import { VehicleId } from '../../game/config/vehicles';

interface UpgradeIconProps {
  type:
    | 'klakson'
    | 'double-shot'
    | 'roket'
    | 'petir'
    | 'oli'
    | 'armor'
    | 'damage'
    | 'firerate'
    | 'speed'
    | 'magnet'
    | 'cooldown'
    | 'regen';
  vehicleId?: VehicleId;
  className?: string;
}

export function UpgradeIcon({ type, vehicleId, className = 'w-16 h-16' }: UpgradeIconProps) {
  switch (type) {
    case 'klakson':
      return (
        <img
          src="/assets/extracted/upg_klakson.png"
          alt="Klakson Sonic"
          referrerPolicy="no-referrer"
          className={`${className} object-contain rounded-lg select-none pointer-events-none`}
        />
      );

    case 'double-shot':
      if (vehicleId === 'motor-ojol') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
            <path d="M24 6L28 17L39 19L31 27L33 39L24 33L15 39L17 27L9 19L20 17L24 6Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
            <polygon points="24,11 26,18 33,19 28,24 29,31 24,27 19,31 20,24 15,19 22,18" fill="#34D399" />
            <circle cx="10" cy="10" r="2" fill="#FACC15" />
            <circle cx="38" cy="11" r="2.5" fill="#38BDF8" />
            <circle cx="39" cy="38" r="2" fill="#FACC15" />
          </svg>
        );
      }
      if (vehicleId === 'bajaj') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#431407" stroke="#EA580C" strokeWidth="2" />
            <path d="M24 7C24 7 34 16 34 26C34 33 29 39 24 39C19 39 14 33 14 26C14 16 24 7 24 7Z" fill="#F97316" />
            <path d="M24 16C24 16 30 22 30 28C30 32 27 36 24 36C21 36 18 32 18 28C18 22 24 16 24 16Z" fill="#FACC15" />
            <path d="M24 25C24 25 27 28 27 31C27 33 25.5 35 24 35C22.5 35 21 33 21 31C21 28 24 25 24 25Z" fill="#FFFFFF" />
          </svg>
        );
      }
      if (vehicleId === 'city-car') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#082F49" stroke="#0284C7" strokeWidth="2" />
            <line x1="16" y1="40" x2="16" y2="8" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="16,5 12,13 20,13" fill="#E0F2FE" />
            <line x1="32" y1="40" x2="32" y2="8" stroke="#06B6D4" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="32,5 28,13 36,13" fill="#E0F2FE" />
            <circle cx="24" cy="24" r="5" fill="#38BDF8" opacity="0.6" />
          </svg>
        );
      }
      if (vehicleId === 'angkot') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#4C0519" stroke="#E11D48" strokeWidth="2" />
            <circle cx="24" cy="24" r="16" fill="#1C1917" stroke="#FB7185" strokeWidth="2" />
            <circle cx="24" cy="24" r="9" fill="#E11D48" />
            <circle cx="24" cy="24" r="4" fill="#FFE4E6" />
            <path d="M8 24C8 15 15 8 24 8" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M40 24C40 33 33 40 24 40" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      }
      if (vehicleId === 'pickup-truck') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#14532D" stroke="#16A34A" strokeWidth="2" />
            {/* 3kg LPG Melon Canister */}
            <rect x="15" y="16" width="18" height="22" rx="7" fill="#22C55E" stroke="#86EFAC" strokeWidth="1.5" />
            <path d="M19 16V10H29V16" stroke="#15803D" strokeWidth="2" fill="none" />
            <rect x="22" y="7" width="4" height="4" fill="#EF4444" rx="1" />
            <path d="M18 24H30" stroke="#15803D" strokeWidth="1.5" />
            <circle cx="24" cy="30" r="3" fill="#FACC15" />
          </svg>
        );
      }
      if (vehicleId === 'police-car') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
            <rect x="10" y="18" width="13" height="12" rx="2" fill="#EF4444" stroke="#FCA5A5" strokeWidth="1.5" />
            <rect x="25" y="18" width="13" height="12" rx="2" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1.5" />
            <line x1="24" y1="6" x2="24" y2="42" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M16 14L16 8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 14L32 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      }
      if (vehicleId === 'heavy-truck') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#3B1A04" stroke="#D97706" strokeWidth="2" />
            {/* Tungsten Sabot Heavy Slug */}
            <polygon points="24,6 31,16 31,38 17,38 17,16" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />
            <rect x="20" y="20" width="8" height="18" fill="#78350F" />
            <line x1="24" y1="12" x2="24" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      }
      if (vehicleId === 'crazy-rich') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="22" fill="#362B03" stroke="#FACC15" strokeWidth="2" />
            {/* Diamond Shuriken */}
            <polygon points="24,7 39,24 24,41 9,24" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="2" />
            <polygon points="24,14 34,24 24,34 14,24" fill="#FACC15" />
            <circle cx="24" cy="24" r="4" fill="#FFFFFF" />
            <circle cx="10" cy="10" r="3" fill="#FACC15" />
            <circle cx="38" cy="38" r="3" fill="#FACC15" />
          </svg>
        );
      }
      return (
        <img
          src="/assets/extracted/upg_doubleshot.png"
          alt="Double Shot"
          referrerPolicy="no-referrer"
          className={`${className} object-contain rounded-lg select-none pointer-events-none`}
        />
      );

    case 'armor':
      return (
        <img
          src="/assets/extracted/upg_armor.png"
          alt="Armor"
          referrerPolicy="no-referrer"
          className={`${className} object-contain rounded-lg select-none pointer-events-none`}
        />
      );

    case 'roket':
      return (
        <img
          src="/assets/extracted/special_rocket.png"
          alt="Roket Knalpot"
          referrerPolicy="no-referrer"
          className={`${className} object-contain rounded-full select-none pointer-events-none`}
        />
      );

    case 'petir':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className}>
          <circle cx="40" cy="40" r="34" fill="#083344" stroke="#38BDF8" strokeWidth="3" />
          <path
            d="M46 12L20 44H38L32 68L60 34H42L46 12Z"
            fill="#38BDF8"
            stroke="#E0F2FE"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'oli':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className}>
          <circle cx="40" cy="40" r="34" fill="#422006" stroke="#FACC15" strokeWidth="3" />
          <rect
            x="24"
            y="18"
            width="32"
            height="44"
            rx="5"
            fill="#EAB308"
            stroke="#FEF08A"
            strokeWidth="2.5"
          />
          <line x1="24" y1="30" x2="56" y2="30" stroke="#0F172A" strokeWidth="4" />
          <line x1="24" y1="50" x2="56" y2="50" stroke="#0F172A" strokeWidth="4" />
          <path d="M40 34C45 40 46 45 40 47C34 45 35 40 40 34Z" fill="#0F172A" />
        </svg>
      );

    default:
      return (
        <img
          src="/assets/extracted/upg_armor.png"
          alt="Upgrade"
          referrerPolicy="no-referrer"
          className={`${className} object-contain rounded-lg select-none pointer-events-none`}
        />
      );
  }
}
