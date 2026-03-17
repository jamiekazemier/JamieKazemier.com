const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const siteHeader = document.getElementById('site-header');
const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.forEach((link) => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add('in-view'));

const sectionObserverTargets = ['selected-work', 'photography', 'technical-work', 'about', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sectionObserverTargets.forEach((section) => sectionObserver.observe(section));
}

const heroImage = document.getElementById('hero-image');
const heroImages = [
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1800&q=68',
  'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1800&q=68',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1800&q=68'
];
let heroIndex = 0;
setInterval(() => {
  heroIndex = (heroIndex + 1) % heroImages.length;
  if (heroImage) heroImage.src = heroImages[heroIndex];
}, 7000);

const GITHUB_OWNER = 'JamieKazemier';
const GITHUB_REPO = 'JamieKazemier.com';
const GITHUB_BRANCH = 'main';
const ALBUMS_FILE_PATH = 'data/albums.json';
const albumsEndpoint = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${ALBUMS_FILE_PATH}`;

const fallbackAlbums = [
  { title: 'Courtside', date: '2026-02-01', photos: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Terrain Studies', date: '2026-01-18', photos: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Fixture Build', date: '2025-12-08', photos: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Structures', date: '2025-11-22', photos: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Street Rain', date: '2025-10-11', photos: ['https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Dusk Terrain', date: '2025-09-30', photos: ['https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Texture Notes', date: '2025-08-15', photos: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'North Study', date: '2025-07-03', photos: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Urban Motion', date: '2025-06-14', photos: ['https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Monochrome Walls', date: '2025-05-20', photos: ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'] }
];

const selectedData = {
  'night-session-frames': {
    title: 'Night Session Frames',
    intro: 'A season-long body of work focused on game tempo, emotion, and transition moments.',
    process: ['Build a shot map before tip-off.', 'Prioritize narrative over highlight-only frames.', 'Edit in sequences to preserve emotional pacing.'],
    outcome: 'Delivered a coherent visual story used for social, editorial, and print.',
    images: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80']
  },
  'terrain-studies': {
    title: 'Terrain Studies',
    intro: 'A worldbuilding case study balancing terrain realism with stylized readability.',
    process: ['Generate varied heightfields in World Machine.', 'Refine erosion passes by gameplay camera distance.', 'Unify mood with restrained material response.'],
    outcome: 'Created a terrain language reusable across multiple environment scenes.',
    images: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80']
  },
  'fixture-build-v3': {
    title: 'Fixture Build v3',
    intro: 'Mechanical fixture redesign for repeatability and reduced setup friction.',
    process: ['Map high-failure joints from previous version.', 'Revise tolerances with quick CNC iterations.', 'Stress-test assembly under real production handling.'],
    outcome: 'Reduced setup time and improved reliability over long production runs.',
    images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80']
  },
  'quiet-structures': {
    title: 'Quiet Structures',
    intro: 'An architecture-focused series exploring rhythm, shadow, and visual restraint.',
    process: ['Scout by light direction, not just location.', 'Compose around repeating geometry.', 'Edit toward tonal consistency and quiet contrast.'],
    outcome: 'Built a portfolio series with a strong editorial and exhibition tone.',
    images: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=1200&q=80']
  }
};

const projectData = {
  'erosion-sandbox': {
    title: 'Erosion Sandbox',
    intro: 'Long-form terrain studies with erosion, shader, and framing experiments.',
    process: ['Automate terrain variants for quick comparison.', 'Track readable silhouette at distance.', 'Validate materials under multiple sky models.'],
    outcome: 'Produced a stable terrain pipeline with clear visual benchmarks.',
    images: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80']
  },
  'motion-rig-kit': {
    title: 'Motion Rig Kit',
    intro: 'A modular hardware set for controlled camera movement in constrained setups.',
    process: ['Prototype critical joints in low-cost materials.', 'Refine repeatability before speed.', 'Document setup sequence for fast handoff.'],
    outcome: 'Reliable rig behavior with less operator fatigue and fewer resets.',
    images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80']
  },
  'material-library': {
    title: 'Material Library',
    intro: 'Surface references captured and normalized for consistent scene development.',
    process: ['Capture texture sets in controlled light.', 'Normalize values for cross-scene consistency.', 'Package assets with practical naming and metadata.'],
    outcome: 'A reusable library that shortened look-dev and reduced texture drift.',
    images: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80']
  }
};

const albumsGrid = document.getElementById('albums-grid');
const moreButton = document.getElementById('albums-more');
const photoGrid = document.getElementById('photo-grid');
const activeTitle = document.getElementById('active-album-title');
const activeMeta = document.getElementById('active-album-meta');
const searchInput = document.getElementById('album-search');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxExit = document.getElementById('lightbox-exit');
const lightboxDownload = document.getElementById('lightbox-download');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxExifToggle = document.getElementById('lightbox-exif-toggle');
const lightboxMeta = document.getElementById('lightbox-meta');
const lightboxExif = document.getElementById('lightbox-exif');
const selectedView = document.getElementById('selected-view');
const selectedBack = document.getElementById('selected-back');
const selectedHero = document.getElementById('selected-hero');
const selectedTitle = document.getElementById('selected-title');
const selectedDescription = document.getElementById('selected-description');
const selectedProcess = document.getElementById('selected-process');
const selectedOutcome = document.getElementById('selected-outcome');
const selectedGallery = document.getElementById('selected-gallery');
const projectView = document.getElementById('project-view');
const projectBack = document.getElementById('project-back');
const projectHero = document.getElementById('project-hero');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectProcess = document.getElementById('project-process');
const projectOutcome = document.getElementById('project-outcome');
const projectGallery = document.getElementById('project-gallery');
const copyEmail = document.getElementById('copy-email');
const copyFeedback = document.getElementById('copy-feedback');

const visibleLimit = 6;
let albums = [...fallbackAlbums];
let filteredAlbums = [...albums];
let showAllAlbums = false;
let activeAlbumIndex = 0;
let downloadableBlobUrl = '';
let downloadableFileName = 'photo.jpg';
let allowDownloadInLightbox = false;
let lastSelectedTrigger = null;
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let currentExif = '';

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date('1970-01-01') : date;
};
const sortAlbumsByDateDesc = (collection) => [...collection].sort((a, b) => parseDate(b.date) - parseDate(a.date));
const formatAlbumDate = (value) => new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(parseDate(value));

const sanitizeAlbums = (data) => {
  if (!Array.isArray(data)) return sortAlbumsByDateDesc([...fallbackAlbums]);
  return sortAlbumsByDateDesc(
    data
      .filter((album) => album && typeof album.title === 'string' && Array.isArray(album.photos))
      .map((album) => ({
        title: album.title,
        date: typeof album.date === 'string' ? album.date : '2025-01-01',
        photos: album.photos.filter((p) => typeof p === 'string' && p)
      }))
      .filter((album) => album.photos.length > 0)
  );
};

const getPhotoMarkup = (url, title, index) => `<figure class="photo-item" data-photo-wrap="${url}" data-photo-index="${index}"><img loading="lazy" decoding="async" sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw" src="${url}" alt="${title} photo ${index + 1}" /></figure>`;

const refreshLightboxImage = () => {
  const src = currentLightboxImages[currentLightboxIndex];
  if (!src || !lightboxImage || !lightboxDownload) return;
  lightboxImage.src = src;
  downloadableFileName = `jamie-photo-${Date.now()}.jpg`;
  lightboxDownload.setAttribute('download', downloadableFileName);
  lightboxDownload.href = src;
  if (lightboxExif) lightboxExif.textContent = currentExif;
};


const preloadLightboxNeighbor = (index) => {
  const nextSrc = currentLightboxImages[(index + 1) % currentLightboxImages.length];
  if (!nextSrc) return;
  const img = new Image();
  img.src = nextSrc;
};

const openLightbox = async (images, index, enableDownload = false, exifLabel = '') => {
  if (!lightbox || !lightboxImage || !Array.isArray(images) || !images.length || !lightboxDownload) return;
  allowDownloadInLightbox = enableDownload;
  lightboxDownload.style.display = enableDownload ? 'inline-flex' : 'none';
  currentLightboxImages = images;
  currentLightboxIndex = Math.max(0, Math.min(index, images.length - 1));
  currentExif = exifLabel;

  if (downloadableBlobUrl) URL.revokeObjectURL(downloadableBlobUrl);
  downloadableBlobUrl = '';

  refreshLightboxImage();
  preloadLightboxNeighbor(currentLightboxIndex);

  if (enableDownload) {
    try {
      const res = await fetch(currentLightboxImages[currentLightboxIndex], { mode: 'cors' });
      const blob = await res.blob();
      downloadableBlobUrl = URL.createObjectURL(blob);
      lightboxDownload.href = downloadableBlobUrl;
    } catch {
      downloadableBlobUrl = '';
    }
  }

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxDownload) return;
  if (downloadableBlobUrl) URL.revokeObjectURL(downloadableBlobUrl);
  downloadableBlobUrl = '';
  allowDownloadInLightbox = false;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxDownload.href = '#';
  if (lightboxMeta) lightboxMeta.hidden = true;
};

const stepLightbox = (direction) => {
  if (!currentLightboxImages.length) return;
  currentLightboxIndex = (currentLightboxIndex + direction + currentLightboxImages.length) % currentLightboxImages.length;
  refreshLightboxImage();
  preloadLightboxNeighbor(currentLightboxIndex);
};

const isUserCanceledSave = (error) => {
  if (!error) return false;
  const name = typeof error.name === 'string' ? error.name : '';
  const message = typeof error.message === 'string' ? error.message.toLowerCase() : '';
  return name === 'AbortError' || name === 'NotAllowedError' || message.includes('aborted') || message.includes('cancel');
};

const downloadCurrentImage = async (event) => {
  event.preventDefault();
  if (!allowDownloadInLightbox) return;
  const src = downloadableBlobUrl || lightboxImage?.src;
  if (!src) return;

  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await window.showSaveFilePicker({ suggestedName: downloadableFileName, types: [{ description: 'Image', accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] } }] });
      const writable = await fileHandle.createWritable();
      const blob = await (await fetch(src)).blob();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (isUserCanceledSave(error)) return;
    }
  }

  const anchor = document.createElement('a');
  anchor.href = src;
  anchor.download = downloadableFileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const attachPhotoClicks = (container, images, enableDownload, exifLabel) => {
  container.querySelectorAll('[data-photo-wrap]').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = Number(item.getAttribute('data-photo-index') || '0');
      openLightbox(images, idx, enableDownload, exifLabel);
    });
  });
};

const renderCaseStudy = (entry, elements, enableDownload = false) => {
  elements.hero.src = entry.images[0];
  elements.title.textContent = entry.title;
  elements.description.textContent = entry.intro;
  elements.process.innerHTML = entry.process.map((step) => `<p class="case-step">${step}</p>`).join('');
  elements.outcome.textContent = `Outcome: ${entry.outcome}`;
  elements.gallery.innerHTML = entry.images.map((img, i) => getPhotoMarkup(img, entry.title, i)).join('');
  attachPhotoClicks(elements.gallery, entry.images, enableDownload, `${entry.title} • 35mm equiv • ISO 800 • 1/1000`);
};

const renderAlbumPreview = () => {
  const activeAlbum = filteredAlbums[activeAlbumIndex];
  if (!activeAlbum || !photoGrid || !activeTitle || !activeMeta) {
    photoGrid.innerHTML = '';
    activeTitle.textContent = 'Album Preview';
    activeMeta.textContent = 'No album selected';
    return;
  }
  activeTitle.textContent = activeAlbum.title;
  activeMeta.textContent = `${formatAlbumDate(activeAlbum.date)}`;
  photoGrid.innerHTML = activeAlbum.photos.map((photo, index) => getPhotoMarkup(photo, activeAlbum.title, index)).join('');
  attachPhotoClicks(photoGrid, activeAlbum.photos, true, `${activeAlbum.title} • ${formatAlbumDate(activeAlbum.date)} • EXIF sample`);
};

const renderAlbums = () => {
  if (!albumsGrid || !moreButton) return;
  albumsGrid.innerHTML = '';

  filteredAlbums.forEach((album, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'album-card';
    if (!showAllAlbums && index >= visibleLimit) card.classList.add('is-hidden');
    if (index === activeAlbumIndex) card.classList.add('is-active');

    const coverImage = album.photos[0] || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80';
    card.innerHTML = `<img loading="lazy" decoding="async" sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw" src="${coverImage}" alt="${album.title} cover image" /><div class="album-meta"><h4>${album.title}</h4><p>${formatAlbumDate(album.date)}</p></div>`;
    card.addEventListener('click', () => {
      activeAlbumIndex = index;
      renderAlbums();
      renderAlbumPreview();
      requestAnimationFrame(() => {
        document.getElementById('photo-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    albumsGrid.appendChild(card);
  });

  moreButton.classList.toggle('is-visible', filteredAlbums.length > visibleLimit);
  moreButton.textContent = showAllAlbums ? 'Show Less' : 'More Albums';
};

const runSearch = () => {
  const term = (searchInput?.value || '').trim().toLowerCase();
  filteredAlbums = sortAlbumsByDateDesc(albums.filter((album) => album.title.toLowerCase().includes(term)));
  activeAlbumIndex = 0;
  showAllAlbums = false;
  renderAlbums();
  renderAlbumPreview();
};

const openDetailSection = (data, key, elements, section, shouldScroll = true, enableDownload = false) => {
  const entry = data[key];
  if (!entry) return;
  renderCaseStudy(entry, elements, enableDownload);
  section.hidden = false;
  if (shouldScroll) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const closeDetailSection = (section, gallery) => {
  section.hidden = true;
  gallery.innerHTML = '';
};

if (copyEmail) {
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyEmail.getAttribute('data-email') || '');
      if (copyFeedback) copyFeedback.textContent = 'Email copied.';
    } catch {
      if (copyFeedback) copyFeedback.textContent = 'Could not copy email on this browser.';
    }
  });
}

if (searchInput) searchInput.addEventListener('input', runSearch);
if (moreButton) moreButton.addEventListener('click', () => { showAllAlbums = !showAllAlbums; renderAlbums(); });
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxExit) lightboxExit.addEventListener('click', closeLightbox);
if (lightboxDownload) lightboxDownload.addEventListener('click', downloadCurrentImage);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => stepLightbox(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => stepLightbox(1));
if (lightboxExifToggle && lightboxMeta) lightboxExifToggle.addEventListener('click', () => { lightboxMeta.hidden = !lightboxMeta.hidden; });
if (lightbox) lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'ArrowRight') stepLightbox(1);
  if (event.key === 'ArrowLeft') stepLightbox(-1);
});

if (selectedBack) selectedBack.addEventListener('click', () => {
  closeDetailSection(selectedView, selectedGallery);
  if (lastSelectedTrigger) {
    lastSelectedTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
    lastSelectedTrigger.focus({ preventScroll: true });
    return;
  }
  document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
if (projectBack) projectBack.addEventListener('click', () => {
  closeDetailSection(projectView, projectGallery);
  document.getElementById('technical-work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('[data-selected]').forEach((item) => {
  item.addEventListener('click', () => {
    lastSelectedTrigger = item;
    openDetailSection(
      selectedData,
      item.getAttribute('data-selected'),
      { hero: selectedHero, title: selectedTitle, description: selectedDescription, process: selectedProcess, outcome: selectedOutcome, gallery: selectedGallery },
      selectedView,
      true,
      false
    );
  });
});

document.querySelectorAll('[data-project]').forEach((item) => {
  item.addEventListener('click', () => openDetailSection(
    projectData,
    item.getAttribute('data-project'),
    { hero: projectHero, title: projectTitle, description: projectDescription, process: projectProcess, outcome: projectOutcome, gallery: projectGallery },
    projectView,
    true,
    false
  ));
});

const loadAlbumsFromGitHub = async () => {
  try {
    const response = await fetch(albumsEndpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load albums from GitHub');
    const githubAlbums = sanitizeAlbums(await response.json());
    if (githubAlbums.length) {
      albums = githubAlbums;
      filteredAlbums = sortAlbumsByDateDesc([...albums]);
    }
  } catch (error) {
    console.warn('Using fallback albums.', error);
    albums = sortAlbumsByDateDesc([...fallbackAlbums]);
    filteredAlbums = [...albums];
  }
  renderAlbums();
  renderAlbumPreview();
};

loadAlbumsFromGitHub();
