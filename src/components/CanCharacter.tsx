import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

type CanMood = 'smug' | 'worried' | 'desperate' | 'defeated';
type AnimState = 'idle' | 'hurt' | 'celebrating';

interface Props {
  resistStreak: number;
  trigger: number;
  lastAction: 'drank' | 'resisted' | null;
}

const MOOD_MESSAGES: Record<CanMood, string[]> = {
  smug: [
    "I'm literally right here.",
    "One sip. That's all I'm asking.",
    "You look thirsty... 👀",
    "Diet. Basically health food.",
    "Your coworker's having one right now.",
    "Long day, huh? I can fix that.",
    "Cold. Bubbly. Waiting.",
    "Miss me? Just a little?",
    "We both know how this ends.",
  ],
  worried: [
    "Okay... don't you miss me?",
    "This feels personal.",
    "Are you... mad at me?",
    "I've been cold this whole time.",
    "We had something special.",
    "Is it water?? It's water, isn't it.",
    "I can change. I swear.",
  ],
  desperate: [
    "Please. I'm begging you.",
    "I have feelings too, you know.",
    "*rattling intensifies*",
    "You used to like me. Remember?",
    "I'll be better. I promise.",
    "Just one sip. One tiny sip.",
    "What did I ever do to you?!",
  ],
  defeated: [
    "...fine. You win this round.",
    "I respect you and I hate it.",
    "*nervous sweating*",
    "My therapist says I'm codependent.",
    "...okay you're genuinely good at this.",
    "I have nothing left.",
    "Tell my family I love them.",
  ],
};

const ACTION_MESSAGES: Record<'drank' | 'resisted', string[]> = {
  resisted: [
    "OW. That hurt.",
    "Okay. Fine. This time.",
    "I'll remember this.",
    "Round to you. For now.",
    "...rude.",
    "I felt that.",
    "You'll crack. Eventually.",
  ],
  drank: [
    "YESSsssss!! 🎉",
    "I KNEW you'd come back!",
    "Welcome home, baby!",
    "That's my human! ❤️",
    "Never doubted us.",
    "We're unstoppable together.",
  ],
};

function getMood(streak: number): CanMood {
  if (streak >= 10) return 'defeated';
  if (streak >= 6) return 'desperate';
  if (streak >= 3) return 'worried';
  return 'smug';
}

function getDamageLevel(streak: number): number {
  if (streak >= 10) return 3;
  if (streak >= 6) return 2;
  if (streak >= 3) return 1;
  return 0;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── SVG Can Drawing ────────────────────────────────────────────────────────

function CanSVG({ mood, damage, animState }: {
  mood: CanMood;
  damage: number;
  animState: AnimState;
}) {
  const silver = '#dce2e8';
  const face = animState === 'celebrating' ? 'celebrating'
    : animState === 'hurt' ? 'hurt'
    : mood;

  return (
    <svg viewBox="0 0 100 160" width="100%" height="100%" overflow="visible">
      <defs>
        <clipPath id="body-clip">
          <rect x="14" y="20" width="72" height="122" rx="7" />
        </clipPath>
      </defs>

      {/* Body */}
      <rect x="14" y="20" width="72" height="122" fill="#e8001d" rx="7" />

      {/* Silver middle band */}
      <rect x="14" y="57" width="72" height="49" fill={silver} />

      {/* Subtle left highlight */}
      <rect x="14" y="28" width="5" height="106" fill="white" opacity="0.07" rx="2" />

      {/* "diet" script */}
      <text x="50" y="50" textAnchor="middle"
        fontFamily="Georgia, serif" fontStyle="italic"
        fontSize="7.5" fill="white" opacity="0.85">diet</text>

      {/* "Coke" script */}
      <text x="50" y="120" textAnchor="middle"
        fontFamily="Georgia, serif" fontStyle="italic"
        fontSize="11" fontWeight="bold" fill="white" opacity="0.85">Coke</text>

      {/* Top ellipse */}
      <ellipse cx="50" cy="20" rx="36" ry="9" fill="#c0c5cb" />
      {/* Inner top */}
      <ellipse cx="50" cy="18" rx="25" ry="6" fill="#b5bac0" />

      {/* Pull tab */}
      <path d="M 44 12 Q 50 9 56 12 L 55 18 L 45 18 Z" fill="#a5aab0" />
      <ellipse cx="50" cy="12" rx="4" ry="2.5" fill="none" stroke="#9aa0a5" strokeWidth="1.2" />

      {/* Bottom ellipse */}
      <ellipse cx="50" cy="142" rx="36" ry="9" fill="#98a0a6" />

      {/* ── DENTS ── */}
      {damage >= 1 && (
        <g clipPath="url(#body-clip)">
          <path d="M 84 78 Q 92 83 84 89" fill="#c0001a" stroke="#a8001a" strokeWidth="0.5" />
          <path d="M 88 79 Q 96 84 88 90" fill="#d00018" opacity="0.4" />
        </g>
      )}
      {damage >= 2 && (
        <g clipPath="url(#body-clip)">
          <path d="M 14 98 Q 6 103 14 109" fill="#c0001a" stroke="#a8001a" strokeWidth="0.5" />
          <path d="M 10 99 Q 2 104 10 110" fill="#d00018" opacity="0.4" />
        </g>
      )}
      {damage >= 3 && (
        <g clipPath="url(#body-clip)">
          <path d="M 82 116 Q 91 121 82 127" fill="#c0001a" stroke="#a8001a" strokeWidth="0.5" />
          <ellipse cx="56" cy="44" rx="7" ry="2.5" fill="#c8001a" opacity="0.5" transform="rotate(-25 56 44)" />
        </g>
      )}

      {/* ── FACE ── */}
      {face === 'celebrating' && (
        <g>
          <path d="M 27 72 Q 36 65 45 72" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 55 72 Q 64 65 73 72" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 31 86 Q 50 97 69 86" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 34 86 Q 50 94 66 86 L 66 91 Q 50 99 34 91 Z" fill="white" stroke="#222" strokeWidth="0.5" />
          <circle cx="25" cy="79" r="5.5" fill="#ff8aaa" opacity="0.3" />
          <circle cx="75" cy="79" r="5.5" fill="#ff8aaa" opacity="0.3" />
          <text x="3"  y="52" fontSize="13">✨</text>
          <text x="78" y="48" fontSize="11">⭐</text>
        </g>
      )}

      {face === 'hurt' && (
        <g>
          <path d="M 27 69 L 45 77 M 27 77 L 45 69" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 55 69 L 73 77 M 55 77 L 73 69" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 35 89 Q 43 86 50 89 Q 57 86 65 89" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="2"  y="60" fontSize="14">💫</text>
          <text x="77" y="54" fontSize="11">✦</text>
        </g>
      )}

      {face === 'smug' && (
        <g>
          {/* Arched outward brows */}
          <path d="M 26 62 Q 36 58 45 63" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 55 63 Q 64 58 74 62" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="36" cy="74" r="7" fill="white" />
          <circle cx="64" cy="74" r="7" fill="white" />
          <circle cx="38" cy="74" r="3.5" fill="#1a1a1a" />
          <circle cx="66" cy="74" r="3.5" fill="#1a1a1a" />
          {/* Half-closed eyelids */}
          <path d="M 29 74 Q 36 66 43 74" fill={silver} />
          <path d="M 57 74 Q 64 66 71 74" fill={silver} />
          {/* Smirk */}
          <path d="M 36 89 Q 47 95 59 90" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {face === 'worried' && (
        <g>
          {/* Inner-raised brows */}
          <path d="M 26 65 Q 36 60 45 64" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 55 64 Q 64 60 74 65" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="74" r="7" fill="white" />
          <circle cx="64" cy="74" r="7" fill="white" />
          <circle cx="36" cy="74" r="3.5" fill="#1a1a1a" />
          <circle cx="64" cy="74" r="3.5" fill="#1a1a1a" />
          {/* Slight frown */}
          <path d="M 36 91 Q 50 87 64 91" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Sweat drop */}
          <ellipse cx="76" cy="66" rx="2.5" ry="3.5" fill="#a8ccee" opacity="0.75" />
        </g>
      )}

      {face === 'desperate' && (
        <g>
          {/* High-raised brows */}
          <path d="M 24 61 Q 36 55 45 62" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 55 62 Q 64 55 76 61" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Wide eyes */}
          <circle cx="36" cy="75" r="8" fill="white" />
          <circle cx="64" cy="75" r="8" fill="white" />
          <circle cx="36" cy="75" r="3.5" fill="#1a1a1a" />
          <circle cx="64" cy="75" r="3.5" fill="#1a1a1a" />
          {/* Frown */}
          <path d="M 34 92 Q 50 85 66 92" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Multiple sweat drops */}
          <ellipse cx="77" cy="63" rx="2" ry="3"   fill="#a8ccee" opacity="0.75" />
          <ellipse cx="81" cy="71" rx="1.5" ry="2.5" fill="#a8ccee" opacity="0.5" />
        </g>
      )}

      {face === 'defeated' && (
        <g>
          {/* Drooping brows */}
          <path d="M 26 65 Q 36 70 45 67" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 55 67 Q 64 70 74 65" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="74" r="7" fill="white" />
          <circle cx="64" cy="74" r="7" fill="white" />
          <circle cx="36" cy="76" r="3.5" fill="#1a1a1a" />
          <circle cx="64" cy="76" r="3.5" fill="#1a1a1a" />
          {/* Heavy eyelids */}
          <path d="M 29 74 Q 36 67 43 74" fill={silver} opacity="0.85" />
          <path d="M 57 74 Q 64 67 71 74" fill={silver} opacity="0.85" />
          {/* Deep sad frown */}
          <path d="M 33 94 Q 50 85 67 94" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Tear */}
          <ellipse cx="32" cy="83" rx="2" ry="3.5" fill="#a8ccee" opacity="0.85" />
          {/* White flag */}
          <line x1="84" y1="53" x2="84" y2="75" stroke="#bbb" strokeWidth="1.5" />
          <path d="M 84 53 L 95 59 L 84 65 Z" fill="white" stroke="#bbb" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CanCharacter({ resistStreak, trigger, lastAction }: Props) {
  const mood = getMood(resistStreak);
  const damage = getDamageLevel(resistStreak);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [speechText, setSpeechText] = useState(() => pickRandom(MOOD_MESSAGES[mood]));
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Trigger action animations
  useEffect(() => {
    if (!lastAction || trigger === 0) return;
    const state: AnimState = lastAction === 'drank' ? 'celebrating' : 'hurt';
    setAnimState(state);
    setSpeechText(pickRandom(ACTION_MESSAGES[lastAction]));
    const t = setTimeout(() => setAnimState('idle'), state === 'celebrating' ? 2600 : 1800);
    return () => clearTimeout(t);
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rotate idle messages
  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimState(s => {
        if (s === 'idle') setSpeechText(pickRandom(MOOD_MESSAGES[mood]));
        return s;
      });
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [mood]);

  // New message when mood tier changes
  useEffect(() => {
    setSpeechText(pickRandom(MOOD_MESSAGES[mood]));
  }, [mood]);

  const bubbleColor =
    animState === 'celebrating' ? 'bg-[#e8001d]/15 text-[#ff4455] border-[#e8001d]/25'
    : animState === 'hurt'      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700';

  const tailColor =
    animState === 'celebrating' ? 'border-t-[#e8001d]/15'
    : animState === 'hurt'      ? 'border-t-emerald-500/10'
    : 'border-t-zinc-800';

  return (
    <div className="flex flex-col items-center gap-3 select-none">

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={speechText}
          initial={{ opacity: 0, y: 5, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`relative px-4 py-2.5 rounded-2xl text-sm font-medium max-w-[220px] text-center border ${bubbleColor}`}
        >
          {speechText}
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-[6px] border-r-[6px] border-t-[8px]
            border-l-transparent border-r-transparent ${tailColor}`} />
        </motion.div>
      </AnimatePresence>

      {/* The can */}
      <motion.div
        className="w-28 h-44 cursor-pointer"
        style={{ transformOrigin: 'center center' }}
        animate={
          // Crumple: hard vertical squish + side wobble, like you crushed it
          animState === 'hurt'
            ? {
                scaleX: [1, 1.38, 0.84, 1.22, 0.91, 1.06, 0.98, 1],
                scaleY: [1, 0.52, 1.18, 0.74, 1.08, 0.94, 1.02, 1],
                x:      [0, -6,   6,   -4,   4,   -2,   1,   0],
                rotate: [0, -5,   5,   -3,   2,   -1,   0.5, 0],
              }
          // Bloat: inflate like carbonation is building, then launch up with joy
          : animState === 'celebrating'
            ? {
                scaleX: [1, 1.24, 0.88, 1.14, 0.93, 1.04, 1],
                scaleY: [1, 1.18, 0.84, 1.10, 0.95, 1.02, 1],
                y:      [0,   -4, -24,   -10,  -18,   -4,  0],
                rotate: [0,    5, -10,     7,   -4,    1,  0],
              }
          // Idle: gentle float + slight sway
          : {
              y:      [0, -7, 0],
              rotate: [0, 1.2, 0, -1.2, 0],
            }
        }
        transition={
          animState === 'idle'
            ? {
                y:      { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
              }
            : animState === 'hurt'
            ? { duration: 0.65, ease: [0.36, 0.07, 0.19, 0.97] }
            : { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
        }
        onClick={() => setSpeechText(pickRandom(MOOD_MESSAGES[mood]))}
        title="Click me"
      >
        <CanSVG mood={mood} damage={damage} animState={animState} />
      </motion.div>

      {/* Streak label */}
      <AnimatePresence>
        {resistStreak > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-zinc-600 text-center"
          >
            {resistStreak} resist{resistStreak === 1 ? '' : 's'} in a row
            {resistStreak >= 10 ? ' — it\'s suffering'
              : resistStreak >= 6 ? ' — it\'s desperate'
              : resistStreak >= 3 ? ' — it\'s worried'
              : ''}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
