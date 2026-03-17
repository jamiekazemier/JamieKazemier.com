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
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

const GITHUB_OWNER = 'JamieKazemier';
const GITHUB_REPO = 'JamieKazemier.com';
const GITHUB_BRANCH = 'main';
const ALBUMS_FILE_PATH = 'data/albums.json';
const albumsEndpoint = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${ALBUMS_FILE_PATH}`;

const fallbackAlbums = [
  { title: 'Courtside', photos: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Terrain Studies', photos: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Fixture Build', photos: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Structures', photos: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Street Rain', photos: ['https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Dusk Terrain', photos: ['https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Texture Notes', photos: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'North Study', photos: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'] }
];

const projectData = {
  'erosion-sandbox': { title: 'Erosion Sandbox', description: 'Long-form terrain studies with erosion passes, shader tests, and cinematic framing iterations.', images: ['https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1200&q=80'] },
  'motion-rig-kit': { title: 'Motion Rig Kit', description: 'Mechanical prototypes and rig revisions focused on repeatable camera moves in dynamic conditions.', images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'] },
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

const sanitizeAlbums = (data) => {
  if (!Array.isArray(data)) return [...fallbackAlbums];
  return data
    .filter((album) => album && typeof album.title === 'string' && Array.isArray(album.photos))
    .map((album) => ({ title: album.title, photos: album.photos.filter((p) => typeof p === 'string' && p) }))
    .filter((album) => album.photos.length > 0);
};

const getPhotoMarkup = (url, albumTitle, index) => `<figure class="photo-item" data-photo-wrap="${url}"><img src="${url}" alt="${albumTitle} photo ${index + 1}" /></figure>`;

const openLightbox = (src) => {
  if (!lightbox || !lightboxImage || !src || !lightboxDownload) return;
  lightboxImage.src = src;
  lightboxDownload.href = src;
  const fileName = `jamie-photo-${Date.now()}.jpg`;
  lightboxDownload.setAttribute('download', fileName);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxDownload) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxDownload.href = '#';
};

const downloadCurrentImage = async (event) => {
  event.preventDefault();
  const src = lightboxImage?.src;
  if (!src) return;
  try {
    const response = await fetch(src, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = lightboxDownload.getAttribute('download') || 'photo.jpg';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(src, '_blank', 'noopener');
  }
};

const attachPhotoClicks = (container) => {
  container.querySelectorAll('[data-photo-wrap]').forEach((item) => {
    item.addEventListener('click', () => openLightbox(item.getAttribute('data-photo-wrap')));
  });
};

const renderAlbumPreview = () => {
  const activeAlbum = filteredAlbums[activeAlbumIndex];
  if (!activeAlbum || !photoGrid || !activeTitle || !activeMeta) {
    if (photoGrid) photoGrid.innerHTML = '';
    if (activeTitle) activeTitle.textContent = 'Album Preview';
    if (activeMeta) activeMeta.textContent = 'No album selected';
    return;
  }
  activeTitle.textContent = activeAlbum.title;
  activeMeta.textContent = `${activeAlbum.photos.length} photo${activeAlbum.photos.length === 1 ? '' : 's'}`;
  photoGrid.innerHTML = activeAlbum.photos.map((photo, index) => getPhotoMarkup(photo, activeAlbum.title, index)).join('');
  attachPhotoClicks(photoGrid);
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
    card.innerHTML = `<img src="${album.photos[0]}" alt="${album.title} thumbnail" /><div class="album-meta"><h4>${album.title}</h4><p>${album.photos.length} photo${album.photos.length === 1 ? '' : 's'}</p></div>`;
    card.addEventListener('click', () => {
      activeAlbumIndex = index;
      renderAlbums();
      renderAlbumPreview();
    });
    albumsGrid.appendChild(card);
  });

  const shouldShowMore = filteredAlbums.length > visibleLimit;
  moreButton.classList.toggle('is-visible', shouldShowMore);
  moreButton.textContent = showAllAlbums ? 'Show Less' : 'More Albums';
};

const runSearch = () => {
  const term = (searchInput?.value || '').trim().toLowerCase();
  filteredAlbums = albums.filter((album) => album.title.toLowerCase().includes(term));
  activeAlbumIndex = 0;
  showAllAlbums = false;
  renderAlbums();
  renderAlbumPreview();
};

const selectAlbumByTitle = (title) => {
  if (!title) return;
  if (searchInput) searchInput.value = '';
  filteredAlbums = [...albums];
  const index = filteredAlbums.findIndex((album) => album.title.toLowerCase() === title.toLowerCase());
  activeAlbumIndex = index >= 0 ? index : 0;
  showAllAlbums = true;
  renderAlbums();
  renderAlbumPreview();
  document.getElementById('photography')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const openProjectPage = (projectKey) => {
  const project = projectData[projectKey];
  if (!project || !projectView || !projectTitle || !projectDescription || !projectGallery) return;
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectGallery.innerHTML = project.images.map((image, i) => getPhotoMarkup(image, project.title, i)).join('');
  attachPhotoClicks(projectGallery);
  projectView.hidden = false;
  projectView.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const closeProjectPage = () => {
  if (!projectView || !projectGallery) return;
  projectView.hidden = true;
  projectGallery.innerHTML = '';
};

if (searchInput) searchInput.addEventListener('input', runSearch);
if (moreButton) moreButton.addEventListener('click', () => { showAllAlbums = !showAllAlbums; renderAlbums(); });
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxExit) lightboxExit.addEventListener('click', closeLightbox);
if (lightboxDownload) lightboxDownload.addEventListener('click', downloadCurrentImage);
if (lightbox) lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
if (projectBack) projectBack.addEventListener('click', closeProjectPage);

document.querySelectorAll('[data-album-open]').forEach((item) => {
  item.addEventListener('click', () => selectAlbumByTitle(item.getAttribute('data-album-open')));
});

document.querySelectorAll('[data-project]').forEach((item) => {
  item.addEventListener('click', () => openProjectPage(item.getAttribute('data-project')));
});

const loadAlbumsFromGitHub = async () => {
  try {
    const response = await fetch(albumsEndpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load albums from GitHub');
    const githubAlbums = sanitizeAlbums(await response.json());
    if (githubAlbums.length) {
      albums = githubAlbums;
      filteredAlbums = [...albums];
    }
  } catch (error) {
    console.warn('Using fallback albums.', error);
  }
  renderAlbums();
  renderAlbumPreview();
};

loadAlbumsFromGitHub();
