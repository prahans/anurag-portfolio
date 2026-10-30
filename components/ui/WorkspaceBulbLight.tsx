/**
 * Decoratively relights the bulb baked into workspace-v1.webp.
 * The shaded bulb glass and nearby warm light vary together.
 * No JS, extra image request, or interactive target is needed.
 */
export function WorkspaceBulbLight() {
  return (
    <div className="workspace-bulb-light" aria-hidden="true">
      <span className="workspace-bulb-room-shade" />
      <span className="workspace-bulb-glass-shade" />
      <span className="workspace-bulb-room-glow" />
      <span className="workspace-bulb-glass-glow" />
    </div>
  );
}
