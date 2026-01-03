(() => {
  const BLOCKED_CLASS = 'anti-inspect-locked';
  let locked = false;

  // Block context menu and common inspect shortcuts
  const blockKeys = (e) => {
    const key = e.key?.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if (
      e.key === 'F12' ||
      (ctrl && e.shiftKey && ['i', 'j', 'c', 's', 'o', 'p'].includes(key)) ||
      (ctrl && key === 'u') ||
      (ctrl && key === 'shift' && e.code === 'KeyI')
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return undefined;
  };

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  window.addEventListener('keydown', blockKeys, true);

  const injectOverlay = () => {
    if (locked) return;
    locked = true;
    const overlay = document.createElement('div');
    overlay.className = 'anti-inspect-overlay';
    overlay.innerHTML = `
      <div class="anti-inspect-card">
        <div class="anti-inspect-title">Security Shield</div>
        <div class="anti-inspect-body">
          Developer tools are blocked on this page. Please close any inspectors to continue.
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.documentElement.classList.add(BLOCKED_CLASS);
  };

  const ensureStyles = () => {
    if (document.getElementById('anti-inspect-style')) return;
    const style = document.createElement('style');
    style.id = 'anti-inspect-style';
    style.textContent = `
      .anti-inspect-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.82);
        backdrop-filter: blur(6px);
        z-index: 2147483647;
        display: grid;
        place-items: center;
        padding: 24px;
        color: #fff;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      }
      .anti-inspect-card {
        background: rgba(20, 20, 20, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 24px 28px;
        max-width: 480px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.35);
      }
      .anti-inspect-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 10px;
        letter-spacing: 0.2px;
      }
      .anti-inspect-body {
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255,255,255,0.85);
      }
      .${BLOCKED_CLASS} {
        pointer-events: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  const devtoolsOpen = () => {
    const threshold = 180;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > threshold || heightDiff > threshold) return true;
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    return performance.now() - start > 40;
  };

  const watchDevTools = () => {
    ensureStyles();
    if (devtoolsOpen()) {
      injectOverlay();
    }
  };

  setInterval(watchDevTools, 1200);
})();
