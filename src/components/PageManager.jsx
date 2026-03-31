// Page manager: desktop = horizontal bar, mobile = 30-slot grid below the page

import { useState }            from 'react';
import { useStore, MAX_PAGES } from '../store.js';
import { useBreakpoint }       from '../hooks/useBreakpoint.js';

//Delete confirmation modal
function DeleteConfirmModal({ pageNumber, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'var(--bg-panel)', border: '1px solid var(--border)',
        borderRadius: '16px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        width: '100%', maxWidth: '360px', margin: '0 16px', overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Delete Page {pageNumber}?</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>This action cannot be undone.</div>
          </div>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', background: 'var(--bg-raised)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

//Delete dot button on each cell 
function PageDeleteBtn({ pageIndex, pageNumber, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(pageIndex, pageNumber); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Delete page ${pageNumber}`}
      style={{
        position: 'absolute', top: '0px', right: '-3px',
        width: '10px', height: '10px', borderRadius: '50%',
        background: hovered ? '#dc2626' : '#ef4444',
        color: 'white', border: '1px solid rgba(0,0,0,0.2)',
        fontSize: '10px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, zIndex: 10,
        transform: hovered ? 'scale(1.15)' : 'scale(1)',
        transition: 'all 0.1s', lineHeight: 1,
      }}>
      ×
    </button>
  );
}

//Main
export default function PageManager() {
  const pages            = useStore((s) => s.pages);
  const currentPageIndex = useStore((s) => s.currentPageIndex);
  const setCurrentPage   = useStore((s) => s.setCurrentPage);
  const addPage          = useStore((s) => s.addPage);
  const deletePage       = useStore((s) => s.deletePage);
  const atCapacity       = pages.length >= MAX_PAGES;
  const { isMobile }     = useBreakpoint();

  const [confirmTarget, setConfirmTarget] = useState(null);
  const handleDelete  = (index, pageNumber) => setConfirmTarget({ index, pageNumber });
  const handleConfirm = () => { deletePage(confirmTarget.index); setConfirmTarget(null); };
  const handleCancel  = () => setConfirmTarget(null);

  //mobile = 30 grid
  if (isMobile) {
    return (
      <>
        {confirmTarget && (
          <DeleteConfirmModal
            pageNumber={confirmTarget.pageNumber}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '4px',
          padding: '8px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {Array.from({ length: MAX_PAGES }, (_, i) => {
            const exists = i < pages.length;
            const active = exists && i === currentPageIndex;
            const isNext = i === pages.length; 

            // add page button
            if (isNext) {
              return (
                <button
                  key={i}
                  onClick={() => !atCapacity && addPage()}
                  disabled={atCapacity}
                  title={atCapacity ? `Max ${MAX_PAGES}` : 'Add page'}
                  style={{
                    height: '32px', borderRadius: '6px',
                    cursor: atCapacity ? 'not-allowed' : 'pointer',
                    background: 'transparent',
                    border: '1px dashed var(--border-strong)',
                    color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: atCapacity ? 0.3 : 0.8,
                    transition: 'all 0.15s',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              );
            }

            // empty placeholder slot
            if (!exists) {
              return (
                <div
                  key={i}
                  style={{
                    height: '32px', borderRadius: '6px',
                    background: 'var(--bg-raised)',
                    border: '1px solid var(--border)',
                    opacity: 0.2,
                  }}
                />
              );
            }

            // existing page
            return (
              <div key={i} style={{ position: 'relative' }}>
                <button
                  onClick={() => setCurrentPage(i)}
                  style={{
                    width: '100%', height: '32px', borderRadius: '6px',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'var(--bg-raised)',
                    color: active ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: active ? '0 0 8px var(--accent-glow)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {i + 1}
                </button>
                {pages.length > 1 && (
                  <PageDeleteBtn pageIndex={i} pageNumber={i + 1} onDelete={handleDelete} />
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

//original tab bar
  return (
    <>
      {confirmTarget && (
        <DeleteConfirmModal
          pageNumber={confirmTarget.pageNumber}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '2px' }}>
        {Array.from({ length: MAX_PAGES }, (_, i) => {
          const exists = i < pages.length;
          const active = exists && i === currentPageIndex;
          const isNext = i === pages.length;

          if (!exists && !isNext) {
            return <div key={i} style={{ flex: 1, height: '28px', borderRadius: '4px', background: 'var(--bg-raised)', opacity: 0.3, border: '1px solid var(--border)' }} />;
          }
          if (isNext) {
            return (
              <button key={i} onClick={() => !atCapacity && addPage()} disabled={atCapacity}
                title={atCapacity ? `Max ${MAX_PAGES}` : 'Add page'}
                style={{ flex: 1, height: '28px', borderRadius: '4px', cursor: atCapacity ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px dashed var(--border-strong)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: atCapacity ? 0.3 : 1, transition: 'all 0.15s' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            );
          }
          return (
            <div key={i} style={{ flex: 1, position: 'relative' }}>
              <button onClick={() => setCurrentPage(i)} style={{
                width: '100%', height: '28px', borderRadius: '4px',
                fontSize: '11px', fontWeight: 500, cursor: 'pointer',
                background: active ? 'var(--accent)' : 'var(--bg-raised)',
                color: active ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: active ? '0 0 8px var(--accent-glow)' : 'none',
                transition: 'all 0.15s',
              }}>
                {i + 1}
              </button>
              {pages.length > 1 && <PageDeleteBtn pageIndex={i} pageNumber={i + 1} onDelete={handleDelete} />}
            </div>
          );
        })}
      </div>
    </>
  );
}