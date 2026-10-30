/**
 * A small, side-on sparrow. Coordinates are local illustration units; the
 * surrounding scene places (53, 66) on the laptop's sloping upper bezel.
 * Separate shoulder, wrist, head and foot groups let the motion stay gentle.
 */
export function WorkspaceBirdIllustration() {
  return (
    <g className="workspace-bird-artwork" transform="translate(-53 -66)">
      <g className="workspace-bird-tail">
        <path d="M35 43 C26 45 17 48 7 53 C8 55 12 56 15 55 L38 50 Z" fill="#655c46" />
        <path d="M34 44 C24 48 17 52 12 58 C16 59 20 56 24 55 L40 49 Z" fill="#7d7255" />
        <path d="M31 47 Q22 51 16 55" fill="none" stroke="#a79a74" strokeWidth=".8" strokeLinecap="round" />
      </g>

      <g className="workspace-bird-wing workspace-bird-wing--far">
        <path d="M46 39 C38 37 29 29 27 20 C27 16 31 15 35 19 C40 24 46 29 49 35 Z" fill="#716a52" />
        <g className="workspace-bird-wingtip">
          <path d="M28 24 C24 18 22 10 23 5 C25 3 27 9 29 14 C28 6 29 2 31 2 C34 3 33 11 34 16 C35 8 37 5 39 7 C41 10 37 20 37 24 L34 29 Z" fill="#79715a" />
          <path d="M29 14 Q30 22 34 26 M34 16 L36 23" fill="none" stroke="#aaa084" strokeWidth=".7" strokeLinecap="round" />
        </g>
      </g>

      <g className="workspace-bird-feet" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M47 54 L45.8 61.5 L47 66.3 M47 66.3 L42.8 66.5 M47 66.3 L51.3 66 M57.6 53.8 L56.9 61.3 L59 65.6 M59 65.6 L54.8 65.9 M59 65.6 L63 65.4" stroke="#956d43" strokeWidth="1.3" />
        <path d="M47.1 56.5 L46.6 61.1 M57.8 56 L57.6 60.8" stroke="#c7a477" strokeWidth=".55" />
      </g>

      <g className="workspace-bird-body">
        {/* The dark back is mostly covered by a softly curved cream belly. */}
        <path d="M27 41 C29 33 39 30 49 29 C54 28 58 30 64 32 C70 37 70 45 65 51 C60 57 50 60 41 56 C34 53 30 47 27 41 Z" fill="#927d5c" />
        <path d="M43 35 C50 34 56 31 64 32 C69 37 69 45 64 51 C59 57 49 59 42 55 C46 50 47 42 43 35 Z" fill="#e0d1ab" />
        <path d="M53 36 C57 36 61 35 65 35 C69 41 66 49 61 52 C57 54 54 54 51 54 C56 49 57 42 53 36 Z" fill="#efe4c8" />
        <path d="M37 51 C44 56 52 57 61 53 C55 59 43 60 37 53 Z" fill="#b8a783" opacity=".7" />
        <path d="M33 36 C38 32 43 31 48 31 C45 35 38 38 32 39 Z" fill="#a9946c" />
        <path d="M48 48 l2 2 M48 52 l2 1.5 M54 52 l1.8 1" fill="none" stroke="#c8b58e" strokeWidth=".65" strokeLinecap="round" />

        <g className="workspace-bird-head">
          <path d="M50 35 C47 30 48 22 53 18 C58 14 66 15 70 20 C73 23 73 28 74 31 C72 36 67 39 61 40 C57 39 53 37 50 35 Z" fill="#9f8059" />
          <path d="M51 25 C51 20 56 17 61 17 C66 16 70 20 71 23 C64 21 59 21 51 25 Z" fill="#806947" />
          <path d="M50 24 C55 20 64 20 69 23 C63 22 57 23 52 26 Z" fill="#b69a6b" />
          <path d="M56 29 C60 29 66 30 73 30 C72 36 66 40 60 39 C56 37 54 34 56 29 Z" fill="#e8dabc" />
          <path d="M55 27 C61 24 68 24 73 28 L73.4 30 C67 28 62 28 57 30 Z" fill="#796347" />
          <path d="M57 25 C62 22.6 67 23 70 24.6" fill="none" stroke="#ead8b4" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M72 28.8 C75 28.6 79 29.6 82 31.3 C78.7 32 75.5 32.3 72.5 31.8 Z" fill="#b47e43" />
          <path d="M72.5 31.8 L81 31.5 Q76.3 34.2 72.7 33.1 Z" fill="#8b653b" />
          <path d="M74 29.4 L78.7 30.8" fill="none" stroke="#d3a367" strokeWidth=".65" strokeLinecap="round" />
          <g className="workspace-bird-eye">
            <ellipse cx="66" cy="26.9" rx="1.7" ry="1.85" fill="#302e24" />
            <circle cx="66.5" cy="26.2" r=".48" fill="#fff5d8" />
          </g>
          <path d="M58 33 Q59.6 34.5 61.3 34.6" fill="none" stroke="#c5b18c" strokeWidth=".7" strokeLinecap="round" />
        </g>

        <g className="workspace-bird-folded-wing">
          <path d="M42 33 C47 34 51 39 49 44 C46 50 39 53 31 52 C33 48 30 43 31 39 C33 35 38 32 42 33 Z" fill="#6f7357" />
          <path d="M40 35 C45 35 48 39 46 43 C43 47 38 49 33 50 C36 45 33 41 35 38 C36 36 38 35 40 35 Z" fill="#90916c" />
          <path d="M44 39 C44 45 39 48 34 51 C39 51 45 48 48 44 Z" fill="#5e664d" />
          <path d="M34 40 Q40 37 44 40 M34 43 Q39 40 43 42 M35 46 Q39 44 41 44" fill="none" stroke="#b7b38b" strokeWidth="1" strokeLinecap="round" opacity=".8" />
          <path d="M37 49 Q42 46 45 42" fill="none" stroke="#91916e" strokeWidth=".8" strokeLinecap="round" />
        </g>
      </g>

      <g className="workspace-bird-wing workspace-bird-wing--near">
        <g className="workspace-bird-wingtip">
          <path d="M31 28 C24 25 18 20 15 14 C13 10 14 7 16 8 L25 19 C20 12 17 5 19 3 C21 2 25 10 29 17 C25 9 24 2 26 1 C29 1 30 11 33 16 C31 7 33 3 35 5 C37 8 36 17 38 22 L39 29 Z" fill="#737752" />
          <path d="M25 19 Q29 24 34 27 M29 17 Q32 22 35 24 M33 16 L36 22" fill="none" stroke="#b0ac7b" strokeWidth=".85" strokeLinecap="round" />
          <path d="M18 13 Q22 20 28 24 M22 8 Q26 17 29 21" fill="none" stroke="#929566" strokeWidth=".8" strokeLinecap="round" />
        </g>
        <path d="M44 39 C38 37 30 33 27 27 C25 23 27 19 31 19 C37 20 44 27 48 32 C50 36 48 39 44 39 Z" fill="#8b9067" />
        <path d="M43 35 C37 32 33 28 31 23 C37 24 43 29 46 33 C47 36 45 37 43 35 Z" fill="#a5a57a" />
        <path d="M30 26 Q35 27 38 31 M33 30 Q38 31 41 34" fill="none" stroke="#c0bb8e" strokeWidth=".85" strokeLinecap="round" />
        <path d="M30 29 C34 34 40 37 44 38" fill="none" stroke="#65704f" strokeWidth=".85" strokeLinecap="round" />
      </g>
    </g>
  );
}
