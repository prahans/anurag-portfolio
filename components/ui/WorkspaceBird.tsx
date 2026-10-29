/**
 * A tiny illustrated visitor to the developer's workspace.
 *
 * This is decorative artwork, not a control: CSS drives a slow flight loop,
 * a long perch on the laptop bezel and gentle wing beats during flight.
 */
export function WorkspaceBird() {
  return (
    <div className="workspace-bird" aria-hidden="true">
      <svg viewBox="0 0 50 42" focusable="false">
        {/* Tail and feet sit behind the body. */}
        <path d="M15 23 Q7 20 2 12 Q10 15 17 17 Z" fill="#796450" stroke="#5a4b3f" strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M24 32 V39 M20 39 H28 M34 32 V39 M30 39 H38" fill="none" stroke="#6e5a45" strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="25" cy="23" rx="15" ry="11" fill="#9a8068" stroke="#584e43" strokeWidth="1.25" />
        <path d="M24 26 Q32 34 39 26 Q34 36 25 32 Z" fill="#efe3cb" />
        <circle cx="32" cy="14" r="9" fill="#9a8068" stroke="#584e43" strokeWidth="1.25" />
        {/* Folded at rest; small flaps while flying. */}
        <path className="workspace-bird-wing" d="M18 23 Q14 11 23 13 Q33 16 34 24 Q27 29 18 23 Z" fill="#687e6c" stroke="#526751" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="35" cy="12" r="1.6" fill="#101522" />
        <circle cx="35.5" cy="11.5" r=".45" fill="#fff" />
        <path d="M40 15 L48 17 L40 20 Z" fill="#ff8759" stroke="#b96b43" strokeWidth=".7" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
