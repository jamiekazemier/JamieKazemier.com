const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
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

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add('in-view'));

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
  'night-session-frames': { title: 'Night Session Frames', description: 'A long-form sports and portrait project shot over a full season, including editing workflow and print selects.', images: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'] },
  'terrain-studies': { title: 'Terrain Studies', description: 'World Machine to in-engine terrain development with heightfield, erosion and material passes.', images: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'] },
  'fixture-build-v3': { title: 'Fixture Build v3', description: 'Mechanical design and prototyping cycle for a durable production fixture system.', images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'] },
  'quiet-structures': { title: 'Quiet Structures', description: 'An architecture and urban-form album centered around contrast, rhythm, and visual silence.', images: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=1200&q=80'] }
};

const projectData = {
  'erosion-sandbox': { title: 'Erosion Sandbox', description: 'Long-form terrain studies with erosion passes, shader tests, and cinematic framing iterations.', images: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'] },
  'motion-rig-kit': { title: 'Motion Rig Kit', description: 'Mechanical prototypes and rig revisions focused on repeatable camera moves in dynamic conditions.', images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'] },
  'material-library': { title: 'Material Library', description: 'Collected scans and reference captures converted into reusable surface assets for 3D environments.', images: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'] }
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
const selectedView = document.getElementById('selected-view');
const selectedBack = document.getElementById('selected-back');
const selectedTitle = document.getElementById('selected-title');
const selectedDescription = document.getElementById('selected-description');
const selectedGallery = document.getElementById('selected-gallery');
const projectView = document.getElementById('project-view');
const projectBack = document.getElementById('project-back');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectGallery = document.getElementById('project-gallery');

const visibleLimit = 4;
let albums = [...fallbackAlbums];
let filteredAlbums = [...albums];
let showAllAlbums = false;
let activeAlbumIndex = 0;
let downloadableBlobUrl = '';
let downloadableFileName = 'photo.jpg';
let allowDownloadInLightbox = false;
let lastSelectedTrigger = null;

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date('1970-01-01') : date;
};

const sortAlbumsByDateDesc = (collection) =>
  [...collection].sort((a, b) => parseDate(b.date) - parseDate(a.date));

const formatAlbumDate = (value) => {
  const date = parseDate(value);
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

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

const getPhotoMarkup = (url, title, index) => `<figure class="photo-item" data-photo-wrap="${url}"><img src="${url}" alt="${title} photo ${index + 1}" /></figure>`;

const openLightbox = async (src, enableDownload = false) => {
  if (!lightbox || !lightboxImage || !src || !lightboxDownload) return;
  allowDownloadInLightbox = enableDownload;
  lightboxDownload.style.display = enableDownload ? 'inline-flex' : 'none';

  lightboxImage.src = src;
  downloadableFileName = `jamie-photo-${Date.now()}.jpg`;
  lightboxDownload.setAttribute('download', downloadableFileName);
  lightboxDownload.href = src;

  if (downloadableBlobUrl) URL.revokeObjectURL(downloadableBlobUrl);
  downloadableBlobUrl = '';

  if (enableDownload) {
    try {
      const res = await fetch(src, { mode: 'cors' });
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
      if (error?.name === 'AbortError') return;
      // fallback below
    }
  }

  const anchor = document.createElement('a');
  anchor.href = src;
  anchor.download = downloadableFileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const attachPhotoClicks = (container, enableDownload) => {
  container.querySelectorAll('[data-photo-wrap]').forEach((item) => {
    item.addEventListener('click', () => openLightbox(item.getAttribute('data-photo-wrap'), enableDownload));
  });
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
  activeMeta.textContent = `${activeAlbum.photos.length} photo${activeAlbum.photos.length === 1 ? '' : 's'} • ${formatAlbumDate(activeAlbum.date)}`;
  photoGrid.innerHTML = activeAlbum.photos.map((photo, index) => getPhotoMarkup(photo, activeAlbum.title, index)).join('');
  attachPhotoClicks(photoGrid, true);
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
    card.innerHTML = `<img src="${coverImage}" alt="${album.title} thumbnail" loading="lazy" /><div class="album-meta"><h4>${album.title}</h4><p>${formatAlbumDate(album.date)} • ${album.photos.length} photo${album.photos.length === 1 ? '' : 's'}</p></div>`;
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

const openDetailSection = (data, key, elements, section, shouldScroll = true) => {
  const entry = data[key];
  if (!entry) return;
  elements.title.textContent = entry.title;
  elements.description.textContent = entry.description;
  elements.gallery.innerHTML = entry.images.map((img, i) => getPhotoMarkup(img, entry.title, i)).join('');
  attachPhotoClicks(elements.gallery, false);
  section.hidden = false;
  if (shouldScroll) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const closeDetailSection = (section, gallery) => {
  section.hidden = true;
  gallery.innerHTML = '';
};

if (searchInput) searchInput.addEventListener('input', runSearch);
if (moreButton) moreButton.addEventListener('click', () => { showAllAlbums = !showAllAlbums; renderAlbums(); });
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxExit) lightboxExit.addEventListener('click', closeLightbox);
if (lightboxDownload) lightboxDownload.addEventListener('click', downloadCurrentImage);
if (lightbox) lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
if (selectedBack) selectedBack.addEventListener('click', () => {
  closeDetailSection(selectedView, selectedGallery);
  if (lastSelectedTrigger) {
    lastSelectedTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
    lastSelectedTrigger.focus({ preventScroll: true });
    return;
  }
  document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
if (projectBack) projectBack.addEventListener('click', () => closeDetailSection(projectView, projectGallery));

document.querySelectorAll('[data-selected]').forEach((item) => {
  item.addEventListener('click', () => {
    lastSelectedTrigger = item;
    openDetailSection(selectedData, item.getAttribute('data-selected'), { title: selectedTitle, description: selectedDescription, gallery: selectedGallery }, selectedView, true);
  });
});

document.querySelectorAll('[data-project]').forEach((item) => {
  item.addEventListener('click', () => openDetailSection(projectData, item.getAttribute('data-project'), { title: projectTitle, description: projectDescription, gallery: projectGallery }, projectView, true));
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
