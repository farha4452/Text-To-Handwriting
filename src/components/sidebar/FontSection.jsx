// Font section: family, size, and ink color controls
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';

const INK_COLORS = [
  { name: 'Black',     value: 'black'     },
  { name: 'Dark Blue', value: 'navy'      },
  { name: 'Blue',      value: 'royalblue' },
  { name: 'Dark Gray', value: 'dimgray'   },
  { name: 'Red',       value: 'crimson'   },
];

export default function FontSection() {
  const settings          = useStore((s) => s.settings);
  const updateSetting     = useStore((s) => s.updateSetting);
  const fonts             = useStore((s) => s.fonts);
  const setFontPickerOpen = useStore((s) => s.setFontPickerOpen);

  const isPreset    = INK_COLORS.some((c) => c.value === settings.fontColor);
  const activeFont  = fonts.find((f) => f.family === settings.fontFamily);
  const displayName = activeFont?.name ?? settings.fontFamily;

  return (
    <Section title="Font" /* emoji="✍️" bolo ai ne banaya */>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Font Family</label>

        {/* clicking anywhere on this row opens the grid picker */}
        <button
          onClick={() => setFontPickerOpen(true)}
          title="Open font picker"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
            background: 'var(--bg-raised)', border: '1px solid var(--border)',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-subtle)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.background = 'var(--bg-raised)'; }}
        >
          {/* font name rendered in the active font */}
          <span style={{
            fontFamily: `'${settings.fontFamily}', cursive`,
            fontSize: '15px',
            color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1, textAlign: 'left',
          }}>
            {displayName}
          </span>

          {/* chevron + plus icon */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            color: 'var(--accent-light)', fontSize: '11px', fontWeight: 600, flexShrink: 0, marginLeft: '8px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </span>
        </button>
      </div>

      <SliderControl label="Font Size" value={settings.fontSize}
        onChange={(v) => updateSetting('fontSize', v)} min={12} max={48} step={1} unit="px" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ink Color</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' }}>
          {INK_COLORS.map(({ name, value }) => {
            const active = settings.fontColor === value;
            return (
              <button key={value} onClick={() => updateSetting('fontColor', value)} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 7px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                background: active ? 'var(--accent-subtle)' : 'var(--bg-raised)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: value, border: '1px solid var(--border)', flexShrink: 0 }} />
                {name}
              </button>
            );
          })}

          <label style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 7px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
            background: !isPreset ? 'var(--accent-subtle)' : 'var(--bg-raised)',
            border: `1px solid ${!isPreset ? 'var(--accent)' : 'var(--border)'}`,
            color: !isPreset ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}>
            <input
              type="color"
              value={isPreset ? '#000000' : settings.fontColor}
              onChange={(e) => updateSetting('fontColor', e.target.value)}
              style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
            />
            Custom
          </label>
        </div>
      </div>
    </Section>
  );
}