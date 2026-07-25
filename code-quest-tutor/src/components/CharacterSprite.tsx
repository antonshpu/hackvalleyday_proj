import idle from '../assets/sprites/idle.png';
import walk1 from '../assets/sprites/walk1.png';
import walk2 from '../assets/sprites/walk2.png';
import walk3 from '../assets/sprites/walk3.png';
import casting from '../assets/sprites/casting.png';
import failing from '../assets/sprites/failing.png';
import jumping from '../assets/sprites/jumping.png';
import falling from '../assets/sprites/falling.png';
import celebrating from '../assets/sprites/celebrating.png';
import type { CharacterState } from '../types';

const STATIC_SPRITE: Record<Exclude<CharacterState, 'WALKING'>, string> = {
  IDLE: idle,
  PUSHING: idle,
  CASTING: casting,
  FAILING: failing,
  JUMPING: jumping,
  FALLING: falling,
  CELEBRATING: celebrating,
};

const ANIMATION_CLASS: Record<CharacterState, string> = {
  IDLE: 'sprite-bob',
  WALKING: 'sprite-walk',
  PUSHING: 'sprite-push',
  CASTING: 'sparkle',
  FAILING: '',
  JUMPING: 'sprite-jump',
  FALLING: 'sprite-fall',
  CELEBRATING: 'sprite-celebrate',
};

interface Props {
  state: CharacterState;
  size?: number;
}

export function CharacterSprite({ state, size = 96 }: Props) {
  const isWalking = state === 'WALKING';
  const style: React.CSSProperties = isWalking
    ? {
        width: size,
        height: size,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        // walk cycle keyframes reference these custom properties
        ['--walk-1' as any]: `url(${walk1})`,
        ['--walk-2' as any]: `url(${walk2})`,
        ['--walk-3' as any]: `url(${walk3})`,
      }
    : { width: size, height: size };

  return (
    <div
      className={`pixelated ${ANIMATION_CLASS[state]}`}
      style={style}
      role="img"
      aria-label={`Wizard character is currently ${state.toLowerCase()}`}
    >
      {!isWalking && (
        <img
          src={STATIC_SPRITE[state]}
          alt=""
          className="pixelated w-full h-full object-contain"
          draggable={false}
        />
      )}
    </div>
  );
}
