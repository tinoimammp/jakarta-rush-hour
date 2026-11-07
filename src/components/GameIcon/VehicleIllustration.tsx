import { VehicleId } from '../../game/config/vehicles';

interface VehicleIllustrationProps {
  vehicleId: VehicleId;
  className?: string;
  locked?: boolean;
  variant?: 'thumb' | 'podium';
}

export function VehicleIllustration({
  vehicleId,
  className = 'w-full h-full',
  locked = false,
  variant = 'thumb',
}: VehicleIllustrationProps) {
  const filterClass = locked ? 'grayscale brightness-75 contrast-125 opacity-80' : '';

  const getAssetUrl = (): string => {
    if (variant === 'podium') {
      switch (vehicleId) {
        case 'motor-ojol':
          return '/assets/extracted/thumb_ojol.png';
        case 'bajaj':
          return '/assets/extracted/podium_bajaj.svg';
        case 'city-car':
          return '/assets/extracted/podium_citycar.png';
        case 'angkot':
          return '/assets/extracted/podium_angkot.png';
        case 'pickup-truck':
          return '/assets/extracted/podium_truck.png';
        case 'police-car':
          return '/assets/extracted/podium_police.svg';
        case 'heavy-truck':
          return '/assets/extracted/podium_heavy.png';
        case 'crazy-rich':
          return '/assets/extracted/podium_crazyrich.svg';
      }
    }

    switch (vehicleId) {
      case 'motor-ojol':
        return '/assets/extracted/thumb_ojol.png';
      case 'bajaj':
        return '/assets/extracted/thumb_bajaj.svg';
      case 'city-car':
        return '/assets/extracted/thumb_citycar.png';
      case 'angkot':
        return '/assets/extracted/thumb_angkot.png';
      case 'pickup-truck':
        return '/assets/extracted/thumb_truck.png';
      case 'police-car':
        return '/assets/extracted/thumb_police.svg';
      case 'heavy-truck':
        return '/assets/extracted/podium_heavy.png';
      case 'crazy-rich':
        return '/assets/extracted/thumb_crazyrich.svg';
    }
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={getAssetUrl()}
        alt={vehicleId}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-contain select-none pointer-events-none ${filterClass}`}
      />
    </div>
  );
}
