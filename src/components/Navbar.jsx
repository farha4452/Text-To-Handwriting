// Navbar: branding, modal triggers, zoom controls , adapts for mobile/tablet

import { useStore }      from '../store.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';

const NavBtn = ({ onClick, title, children, style }) => (
  <button onClick={onClick} title={title} style={{
    padding: '6px', borderRadius: '8px', background: 'transparent',
    color: 'var(--text-secondary)', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
    ...style,
  }}
  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
    {children}
  </button>
);

export default function Navbar() {
  const toggleSidebar      = useStore((s) => s.toggleSidebar);
  const sidebarOpen        = useStore((s) => s.sidebarOpen);
  const setHelpOpen        = useStore((s) => s.setHelpOpen);
  const setFontPickerOpen  = useStore((s) => s.setFontPickerOpen);
  const setExportModalOpen = useStore((s) => s.setExportModalOpen);
  const setColorTagsOpen   = useStore((s) => s.setColorTagsOpen);
  const darkMode           = useStore((s) => s.darkMode);
  const toggleDarkMode     = useStore((s) => s.toggleDarkMode);
  const zoom               = useStore((s) => s.zoom);
  const zoomIn             = useStore((s) => s.zoomIn);
  const zoomOut            = useStore((s) => s.zoomOut);
  const resetZoom          = useStore((s) => s.resetZoom);

  const { isMobile, isTablet } = useBreakpoint();

  return (
    <nav style={{
      height: '48px', padding: '0 12px', flexShrink: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 0 var(--border)',
    }}>
      {/* left: sidebar toggle + branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        {/* on tablet show sidebar toggle; on mobile no sidebar toggle (tabs handle it) */}
        {!isMobile && (
          <NavBtn onClick={toggleSidebar} title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2={sidebarOpen ? '15' : '21'} y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </NavBtn>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </div>
          {/* hide subtitle on mobile to save space */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {isMobile ? 'TXT2HND' : 'Text to Handwriting'}
            </span>
            {!isMobile && (
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                by Satvik Hemant Gupta
              </span>
            )}
          </div>
        </div>
      </div>

      {/* right: actions , mobile shows minimal set */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>

        {/* on mobile: color tags + dark mode only */}
        {isMobile ? (
          <>
            <NavBtn onClick={() => setColorTagsOpen(true)} title="Color & font tags">
              <PaletteIcon />
            </NavBtn>
            <NavBtn onClick={toggleDarkMode} title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </NavBtn>
          </>
        ) : (
          <>
            <NavBtn onClick={() => setColorTagsOpen(true)} title="Color & font tags">
              <PaletteIcon />
            </NavBtn>

            <NavBtn onClick={() => setFontPickerOpen(true)} title="Font picker">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
              </svg>
            </NavBtn>

            <NavBtn onClick={toggleDarkMode} title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </NavBtn>

            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

            {/* zoom controls , hidden on small tablet to save space */}
            {!isTablet && (
              <>
                <NavBtn onClick={zoomOut} title="Zoom out"><ZoomOutIcon /></NavBtn>
                <button onClick={resetZoom} title="Reset zoom" style={{
                  padding: '3px 7px', borderRadius: '6px', background: 'var(--bg-raised)',
                  border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  fontSize: '11px', fontVariantNumeric: 'tabular-nums', cursor: 'pointer',
                  minWidth: '42px', textAlign: 'center',
                }}>
                  {Math.round(zoom * 100)}%
                </button>
                <NavBtn onClick={zoomIn} title="Zoom in"><ZoomInIcon /></NavBtn>
                <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />
              </>
            )}
          </>
        )}

        {/* download always visible */}
        <button onClick={() => setExportModalOpen(true)} className="btn-accent"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: isMobile ? '6px 10px' : '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {!isMobile && 'Download'}
        </button>

        {!isMobile && (
          <NavBtn onClick={() => setHelpOpen(true)} title="Help">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </NavBtn>
        )}
      </div>
    </nav>
  );
}

// SVG icon components
function PaletteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.27-.1-.51-.26-.7-.16-.2-.25-.44-.25-.7 0-.55.45-1 1-1h1.18c1.94 0 3.54-1.6 3.54-3.54C22 7.22 17.52 2 12 2z"/>
      <circle cx="7.5"  cy="12"   r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="10"   cy="7.5"  r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="14"   cy="7.5"  r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="16.5" cy="12"   r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function ZoomOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  );
}
function ZoomInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  );
}
