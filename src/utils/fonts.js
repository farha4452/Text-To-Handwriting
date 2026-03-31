// Font management: builtin list, auto-detected local fonts, custom upload/unload

export const BUILTIN_FONTS = [
  // Casual / Everyday handwriting
  { name: 'Caveat',               family: 'Caveat',               category: 'builtin' },
  { name: 'Indie Flower',         family: 'Indie Flower',         category: 'builtin' },
  { name: 'Kalam',                family: 'Kalam',                category: 'builtin' },
  { name: 'Patrick Hand',         family: 'Patrick Hand',         category: 'builtin' },
  { name: 'Architects Daughter',  family: 'Architects Daughter',  category: 'builtin' },
  { name: 'Coming Soon',          family: 'Coming Soon',          category: 'builtin' },
  { name: 'Just Another Hand',    family: 'Just Another Hand',    category: 'builtin' },
  { name: 'Reenie Beanie',        family: 'Reenie Beanie',        category: 'builtin' },
  { name: 'Bad Script',           family: 'Bad Script',           category: 'builtin' },
  { name: 'Nanum Pen Script',     family: 'Nanum Pen Script',     category: 'builtin' },
  { name: 'Loved by the King',    family: 'Loved by the King',    category: 'builtin' },
  { name: 'Gochi Hand',           family: 'Gochi Hand',           category: 'builtin' },
  { name: 'Sriracha',             family: 'Sriracha',             category: 'builtin' },
  { name: 'Handlee',              family: 'Handlee',              category: 'builtin' },
  { name: 'Schoolbell',           family: 'Schoolbell',           category: 'builtin' },
  { name: 'Dawning of a New Day', family: 'Dawning of a New Day', category: 'builtin' },
  { name: 'Sue Ellen Francisco',  family: 'Sue Ellen Francisco',  category: 'builtin' },
  { name: 'Zeyada',               family: 'Zeyada',               category: 'builtin' },
  { name: 'Cedarville Cursive',   family: 'Cedarville Cursive',   category: 'builtin' },
  { name: 'Kristi',               family: 'Kristi',               category: 'builtin' },

  // Cursive / Script 
  { name: 'Dancing Script',       family: 'Dancing Script',       category: 'builtin' },
  { name: 'Sacramento',           family: 'Sacramento',           category: 'builtin' },
  { name: 'Shadows Into Light',   family: 'Shadows Into Light',   category: 'builtin' },
  { name: 'Homemade Apple',       family: 'Homemade Apple',       category: 'builtin' },
  { name: 'Great Vibes',          family: 'Great Vibes',          category: 'builtin' },
  { name: 'Pacifico',             family: 'Pacifico',             category: 'builtin' },
  { name: 'Satisfy',              family: 'Satisfy',              category: 'builtin' },
  { name: 'Cookie',               family: 'Cookie',               category: 'builtin' },
  { name: 'Allura',               family: 'Allura',               category: 'builtin' },
  { name: 'Alex Brush',           family: 'Alex Brush',           category: 'builtin' },
  { name: 'Parisienne',           family: 'Parisienne',           category: 'builtin' },
  { name: 'Marck Script',         family: 'Marck Script',         category: 'builtin' },
  { name: 'Meddon',               family: 'Meddon',               category: 'builtin' },
  { name: 'Qwigley',              family: 'Qwigley',              category: 'builtin' },
  { name: 'Rouge Script',         family: 'Rouge Script',         category: 'builtin' },

  // Bold / Marker / Ink
  { name: 'Permanent Marker',     family: 'Permanent Marker',     category: 'builtin' },
  { name: 'Rock Salt',            family: 'Rock Salt',            category: 'builtin' },
  { name: 'Gloria Hallelujah',    family: 'Gloria Hallelujah',    category: 'builtin' },
  { name: 'Covered By Your Grace',family: 'Covered By Your Grace',category: 'builtin' },
  { name: 'Amatic SC',            family: 'Amatic SC',            category: 'builtin' },
  { name: 'Patrick Hand SC',      family: 'Patrick Hand SC',      category: 'builtin' },

  // Elegant / Formal
  { name: 'Mrs Saint Delafield',  family: 'Mrs Saint Delafield',  category: 'builtin' },
  { name: 'Pinyon Script',        family: 'Pinyon Script',        category: 'builtin' },
  { name: 'Tangerine',            family: 'Tangerine',            category: 'builtin' },
  { name: 'Euphoria Script',      family: 'Euphoria Script',      category: 'builtin' },
  { name: 'Licorice',             family: 'Licorice',             category: 'builtin' },
  { name: 'Petit Formal Script',  family: 'Petit Formal Script',  category: 'builtin' },

  // Quirky / Unique
  { name: 'Shadows Into Light Two', family: 'Shadows Into Light Two', category: 'builtin' },
  { name: 'Give You Glory',       family: 'Give You Glory',       category: 'builtin' },
  { name: 'Waiting for the Sunrise', family: 'Waiting for the Sunrise', category: 'builtin' },
];

const fontFiles = import.meta.glob('/public/fonts/*.{ttf,otf,woff,woff2}', { eager: true, as: 'url' });

export const LOCAL_FONTS = Object.entries(fontFiles).map(([filePath, url]) => {
  const filename = filePath.split('/').pop();
  const ext      = filename.split('.').pop().toLowerCase();
  const name = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  const family = `Local_${name.replace(/\s+/g, '_')}`;
  return { name, family, file: filename, ext, url };
});

export function registerLocalFonts() {
  LOCAL_FONTS.forEach(({ name, family, ext, url }) => {
    const id = `local-font-${family}`;
    if (document.getElementById(id)) return;
    const fmt   = ext === 'woff2' ? 'woff2' : ext === 'woff' ? 'woff' : ext === 'otf' ? 'opentype' : 'truetype';
    const style = document.createElement('style');
    style.id    = id;
    style.textContent = `@font-face { font-family: '${family}'; src: url('${url}') format('${fmt}'); font-weight: normal; font-style: normal; font-display: swap; }`;
    document.head.appendChild(style);
  });
}

export function loadCustomFont(displayName, dataUrl) {
  const family = `HND_${displayName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  if (document.getElementById(`font-${family}`)) return family;
  const style = document.createElement('style');
  style.id    = `font-${family}`;
  style.textContent = `@font-face { font-family: '${family}'; src: url('${dataUrl}'); font-weight: normal; font-style: normal; font-display: swap; }`;
  document.head.appendChild(style);
  return family;
}

export function unloadCustomFont(displayName) {
  const family = `HND_${displayName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  document.getElementById(`font-${family}`)?.remove();
}

export function readFontFile(file) {
  return new Promise((resolve, reject) => {
    const reader   = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function fontNameFromFile(file) {
  return file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]/g, ' ')
    .trim();
}