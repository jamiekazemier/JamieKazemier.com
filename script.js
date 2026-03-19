const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const siteHeader = document.getElementById('site-header');
const navScrim = document.getElementById('nav-scrim');
const yearElement = document.getElementById('year');
const lastEditedElement = document.getElementById('last-edited');
const now = new Date();
if (yearElement) yearElement.textContent = now.getUTCFullYear();
if (lastEditedElement) {
  const stamp = lastEditedElement.dataset.lastEdited || lastEditedElement.textContent?.trim();
  if (stamp) lastEditedElement.textContent = stamp;
}

const closeNav = () => {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  if (navScrim) navScrim.hidden = true;
};

const toggleNav = () => {
  if (!siteNav || !menuToggle) return;
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
  if (navScrim) navScrim.hidden = !isOpen;
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', toggleNav);
  navLinks.forEach((link) => link.addEventListener('click', closeNav));
  navScrim?.addEventListener('click', closeNav);
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeNav();
  });
}

let heroParallaxFrame = null;
const syncScrollState = () => {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  if (heroParallaxFrame) return;
  heroParallaxFrame = window.requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--hero-parallax', `${Math.min(window.scrollY * 0.12, 64)}px`);
    document.documentElement.style.setProperty('--topo-shift', `${Math.min(window.scrollY * 0.04, 36)}px`);
    heroParallaxFrame = null;
  });
};

window.addEventListener('scroll', syncScrollState, { passive: true });
syncScrollState();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

const sectionObserverTargets = ['about', 'photography', 'technical-work', 'contact']
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

const heroImagePrimary = document.getElementById('hero-image-primary');
const heroImageSecondary = document.getElementById('hero-image-secondary');
const heroImages = [
  'https://github.com/jamiekazemier/JamieKazemier.com/blob/main/hero%20shot.jpg?raw=true',
  'https://github.com/jamiekazemier/JamieKazemier.com/blob/main/hero%20shot%202.jpg?raw=true',
  'https://github.com/jamiekazemier/JamieKazemier.com/blob/main/hero%20shot%203.jpg?raw=true'
];
const heroLayers = [heroImagePrimary, heroImageSecondary].filter(Boolean);
const heroPreloaded = new Map();
let heroIndex = 0;
let activeHeroLayerIndex = 0;
let heroRotationTimer = null;
let isHeroTransitioning = false;

const preloadHeroImage = (src) => {
  if (heroPreloaded.has(src)) return heroPreloaded.get(src);
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  const ready = image.decode
    ? image.decode().catch(() => undefined).then(() => image)
    : new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
      }).catch(() => undefined);
  heroPreloaded.set(src, ready);
  return ready;
};

const finalizeHeroSwap = (currentLayer, nextLayer, nextLayerIndex, normalizedIndex, nextSrc) => {
  nextLayer.src = nextSrc;
  nextLayer.dataset.loadedSrc = nextSrc;
  nextLayer.classList.add('is-active');
  currentLayer.classList.remove('is-active');
  activeHeroLayerIndex = nextLayerIndex;
  heroIndex = normalizedIndex;
  isHeroTransitioning = false;
};

const swapHeroImage = async (nextIndex) => {
  if (heroLayers.length < 2 || isHeroTransitioning) return;
  const normalizedIndex = (nextIndex + heroImages.length) % heroImages.length;
  const nextSrc = heroImages[normalizedIndex];
  if (heroImages[heroIndex] === nextSrc) return;

  isHeroTransitioning = true;
  const currentLayer = heroLayers[activeHeroLayerIndex];
  const nextLayerIndex = (activeHeroLayerIndex + 1) % heroLayers.length;
  const nextLayer = heroLayers[nextLayerIndex];

  try {
    await preloadHeroImage(nextSrc);
    finalizeHeroSwap(currentLayer, nextLayer, nextLayerIndex, normalizedIndex, nextSrc);
  } catch (_error) {
    isHeroTransitioning = false;
  }
};

heroImages.forEach((src) => {
  void preloadHeroImage(src);
});

if (heroImagePrimary) {
  heroImagePrimary.dataset.loadedSrc = heroImages[0];
}

if (heroLayers.length > 1) {
  heroRotationTimer = window.setInterval(() => {
    void swapHeroImage(heroIndex + 1);
  }, 9000);
}

const GITHUB_OWNER = 'JamieKazemier';
const GITHUB_REPO = 'JamieKazemier.com';
const GITHUB_BRANCH = 'main';
const ALBUMS_FILE_PATH = 'data/albums.json';
const albumsEndpoint = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${ALBUMS_FILE_PATH}`;

const fallbackAlbums = [
  {
    title: 'HEAD of the river Amstel',
    date: '2026-03-08',
    descriptor: 'Rowing competition in the canals of Amsterdam',
    photos: ['https://api.esrtheta.nl/mediafiles/photoalbums/000111520260308-Head-of-the-river-Amstel/000111520260308-Head-of-the-river-Amstel-06a5dcbc.jpg']
  },
  {
    title: 'Compo Traika',
    date: '2026-02-22',
    descriptor: 'Compo training camp at TSR Vidar',
    photos: ['https://api.esrtheta.nl/mediafiles/photoalbums/000111120260222-Comporno-Zondag/000111120260222-Comporno-Zondag-f8768515.jpg']
  },
  {
    title: 'Theta Herfstregatta',
    date: '2025-12-08',
    descriptor: 'Placeholder description',
    photos: ['https://i.imgur.com/csDwH7W.jpeg']
  },
  {
    title: 'TEMP',
    date: '2025-11-22',
    descriptor: 'Placeholder descriptionm',
    photos: ['https://i.imgur.com/NTYrt3G.jpeg']
  },
  {
    title: 'TEMPn',
    date: '2025-10-11',
    descriptor: 'Placeholder description',
    photos: ['https://i.imgur.com/8fiP3iU.jpeg']
  },
  {
    title: 'TEMPy',
    date: '2025-09-30',
    descriptor: 'Placeholder descriptiond',
    photos: ['https://i.imgur.com/j8knNeK.jpeg']
  },
  {
    title: 'TEMP',
    date: '2025-08-15',
    descriptor: 'Placeholder description',
    photos: ['https://i.imgur.com/XmJEpxy.jpeg']
  }
];

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
const activeAlbumCount = document.getElementById('active-album-count');
const searchInput = document.getElementById('album-search');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxExit = document.getElementById('lightbox-exit');
const lightboxDownload = document.getElementById('lightbox-download');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxExifToggle = document.getElementById('lightbox-exif-toggle');
const lightboxMeta = document.getElementById('lightbox-meta');
const lightboxExif = document.getElementById('lightbox-exif');
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
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let currentLightboxTitle = '';
let currentExif = '';
let touchStartX = 0;

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date('1970-01-01') : date;
};
const sortAlbumsByDateDesc = (collection) => [...collection].sort((a, b) => parseDate(b.date) - parseDate(a.date));
const formatAlbumDate = (value) => new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(parseDate(value));

const looksLikePlaceholderTitle = (value) => !value || /^img[_\s-]?\d+/i.test(value) || /^album\s*\d*/i.test(value) || /^untitled/i.test(value);

const buildEditorialTitle = (album, index) => {
  const source = `${album.sport || ''} ${album.location || ''} ${album.mood || ''}`.trim();
  if (source) return source.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ').slice(0, 38);
  return `Matchday Session ${String(index + 1).padStart(2, '0')}`;
};

const normalizeAlbum = (album, index) => {
  const titleCandidate = typeof album.title === 'string' ? album.title.trim() : '';
  const title = looksLikePlaceholderTitle(titleCandidate) ? buildEditorialTitle(album, index) : titleCandidate;
  const descriptor = typeof album.descriptor === 'string' ? album.descriptor.trim().slice(0, 64) : '';
  return {
    title,
    date: typeof album.date === 'string' ? album.date : '2025-01-01',
    descriptor,
    photos: Array.isArray(album.photos) ? album.photos.filter((p) => typeof p === 'string' && p) : []
  };
};

const sanitizeAlbums = (data) => {
  if (!Array.isArray(data)) return sortAlbumsByDateDesc(fallbackAlbums.map((album, index) => normalizeAlbum(album, index)));
  return sortAlbumsByDateDesc(
    data
      .filter((album) => album && Array.isArray(album.photos))
      .map((album, index) => normalizeAlbum(album, index))
      .filter((album) => album.photos.length > 0)
  );
};

const buildEditorialSequence = (photos) => {
  const uniquePhotos = [...new Set(photos)];
  if (uniquePhotos.length < 4) return uniquePhotos;

  const opener = uniquePhotos[0];
  const body = uniquePhotos.slice(1);
  const middle = Math.ceil(body.length / 2);
  const firstHalf = body.slice(0, middle);
  const secondHalf = body.slice(middle);
  const woven = [];

  for (let i = 0; i < Math.max(firstHalf.length, secondHalf.length); i += 1) {
    if (firstHalf[i]) woven.push(firstHalf[i]);
    if (secondHalf[i]) woven.push(secondHalf[i]);
  }

  return [opener, ...woven];
};

const getPhotoLayoutClass = (index, total) => {
  if (total === 1) return 'bento-hero';
  if (total === 2) return index === 0 ? 'bento-wide' : 'bento-tall';
  const pattern = ['bento-hero', 'bento-tall', 'bento-standard', 'bento-wide', 'bento-standard', 'bento-square'];
  return pattern[index % pattern.length];
};

const createAlbumFallbackDataUri = (title = 'Album cover') => {
  const safeTitle = String(title).replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char] || char));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#111722"/><rect x="34" y="34" width="1132" height="732" rx="20" fill="#172230" stroke="rgba(117,180,255,.28)"/><text x="72" y="706" fill="#ecf2f8" font-size="42" font-family="Inter, Arial, sans-serif">${safeTitle}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getPhotoMarkup = (url, title, index, total, eager = false) => {
  const loading = eager || index < 2 ? 'eager' : 'lazy';
  const sizes = '(max-width: 700px) 100vw, (max-width: 1120px) 50vw, 33vw';
  const layoutClass = getPhotoLayoutClass(index, total);
  const fallback = createAlbumFallbackDataUri(title);
  return `<figure class="photo-item ${layoutClass}" data-photo-wrap="${url}" data-photo-index="${index}"><img loading="${loading}" decoding="async" sizes="${sizes}" src="${url}" alt="${title} photo ${index + 1}" data-fallback-src="${fallback}" /><figcaption>${String(index + 1).padStart(2, '0')}</figcaption></figure>`;
};

const refreshLightboxImage = () => {
  const src = currentLightboxImages[currentLightboxIndex];
  if (!src || !lightboxImage || !lightboxDownload) return;
  lightboxImage.src = src;
  downloadableFileName = `jamie-photo-${Date.now()}.jpg`;
  lightboxDownload.setAttribute('download', downloadableFileName);
  lightboxDownload.href = src;
  if (lightboxExif) lightboxExif.textContent = currentExif;
  if (lightboxTitle) lightboxTitle.textContent = currentLightboxTitle;
  if (lightboxCounter) lightboxCounter.textContent = `${String(currentLightboxIndex + 1).padStart(2, '0')} / ${String(currentLightboxImages.length).padStart(2, '0')}`;
};

const preloadLightboxNeighbor = (index) => {
  const nextSrc = currentLightboxImages[(index + 1) % currentLightboxImages.length];
  if (!nextSrc) return;
  const img = new Image();
  img.src = nextSrc;
};

const openLightbox = async (images, index, enableDownload = false, exifLabel = '', titleLabel = 'Photo Story') => {
  if (!lightbox || !lightboxImage || !Array.isArray(images) || !images.length || !lightboxDownload) return;
  allowDownloadInLightbox = enableDownload;
  lightboxDownload.style.display = enableDownload ? 'inline-flex' : 'none';
  currentLightboxImages = images;
  currentLightboxIndex = Math.max(0, Math.min(index, images.length - 1));
  currentExif = exifLabel;
  currentLightboxTitle = titleLabel;

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
  siteHeader?.classList.add('is-lightbox-hidden');
  closeNav();
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxDownload) return;
  if (downloadableBlobUrl) URL.revokeObjectURL(downloadableBlobUrl);
  downloadableBlobUrl = '';
  allowDownloadInLightbox = false;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  siteHeader?.classList.remove('is-lightbox-hidden');
  lightboxImage.src = '';
  lightboxDownload.href = '#';
  if (lightboxMeta) lightboxMeta.hidden = true;
  if (lightboxTitle) lightboxTitle.textContent = '';
  if (lightboxCounter) lightboxCounter.textContent = '';
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

const attachImageFallbacks = (container) => {
  container.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.getAttribute('data-fallback-src');
      if (!fallback || img.src === fallback) return;
      img.src = fallback;
      img.closest('.album-image-wrap, .photo-item')?.classList.add('is-fallback');
    }, { once: true });
  });
};

const attachPhotoClicks = (container, images, enableDownload, exifLabel, titleLabel) => {
  container.querySelectorAll('[data-photo-wrap]').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = Number(item.getAttribute('data-photo-index') || '0');
      openLightbox(images, idx, enableDownload, exifLabel, titleLabel);
    });
  });
};

const renderCaseStudy = (entry, elements, enableDownload = false) => {
  elements.hero.src = entry.images[0];
  elements.title.textContent = entry.title;
  elements.description.textContent = entry.intro;
  elements.process.innerHTML = entry.process.map((step) => `<p class="case-step">${step}</p>`).join('');
  elements.outcome.textContent = `Outcome: ${entry.outcome}`;
  elements.gallery.innerHTML = entry.images.map((img, i) => getPhotoMarkup(img, entry.title, i, entry.images.length)).join('');
  attachImageFallbacks(elements.gallery);
  attachPhotoClicks(elements.gallery, entry.images, enableDownload, `${entry.title} • 35mm equiv • ISO 800 • 1/1000`, entry.title);
};

const renderAlbumPreview = () => {
  const activeAlbum = filteredAlbums[activeAlbumIndex];
  if (!activeAlbum || !photoGrid || !activeTitle || !activeMeta) {
    photoGrid.innerHTML = '';
    activeTitle.textContent = 'Album Preview';
    activeMeta.textContent = 'No album selected';
    if (activeAlbumCount) activeAlbumCount.textContent = '';
    return;
  }
  const sequencedPhotos = buildEditorialSequence(activeAlbum.photos);
  activeTitle.textContent = activeAlbum.title;
  activeMeta.textContent = activeAlbum.descriptor ? `${formatAlbumDate(activeAlbum.date)} • ${activeAlbum.descriptor}` : `${formatAlbumDate(activeAlbum.date)}`;
  if (activeAlbumCount) activeAlbumCount.textContent = `${sequencedPhotos.length} curated frames`;
  photoGrid.innerHTML = sequencedPhotos.map((photo, index) => getPhotoMarkup(photo, activeAlbum.title, index, sequencedPhotos.length, index === 0)).join('');
  attachImageFallbacks(photoGrid);
  attachPhotoClicks(photoGrid, sequencedPhotos, true, `${activeAlbum.title} • ${formatAlbumDate(activeAlbum.date)} • Editorial sequence`, activeAlbum.title);
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

    const sequencedPhotos = buildEditorialSequence(album.photos);
    const coverFallback = createAlbumFallbackDataUri(album.title);
    const coverImage = sequencedPhotos[0] || coverFallback;
    card.innerHTML = `<div class="album-image-wrap"><img loading="lazy" decoding="async" sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw" src="${coverImage}" alt="${album.title} cover image" data-fallback-src="${coverFallback}" /><div class="album-overlay"><p class="album-date">${formatAlbumDate(album.date)}</p><h4>${album.title}</h4><p class="album-count">${album.photos.length} frames</p></div></div><div class="album-meta">${album.descriptor ? `<p>${album.descriptor}</p>` : '<p>Curated sequence with editorial pacing.</p>'}</div>`;
    attachImageFallbacks(card);
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
  filteredAlbums = sortAlbumsByDateDesc(albums.filter((album) => album.title.toLowerCase().includes(term) || (album.descriptor || '').toLowerCase().includes(term)));
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
if (lightbox) lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
if (lightbox) lightbox.addEventListener('touchend', (event) => {
  const endX = event.changedTouches[0]?.clientX || 0;
  const delta = endX - touchStartX;
  if (Math.abs(delta) < 40 || !lightbox.classList.contains('open')) return;
  if (delta < 0) stepLightbox(1);
  if (delta > 0) stepLightbox(-1);
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'ArrowRight') stepLightbox(1);
  if (event.key === 'ArrowLeft') stepLightbox(-1);
});

if (projectBack) projectBack.addEventListener('click', () => {
  closeDetailSection(projectView, projectGallery);
  document.getElementById('technical-work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    albums = sortAlbumsByDateDesc(fallbackAlbums.map((album, index) => normalizeAlbum(album, index)));
    filteredAlbums = [...albums];
  }
  renderAlbums();
  renderAlbumPreview();
};

loadAlbumsFromGitHub();
