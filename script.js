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

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
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
  { title: 'Street Rain', photos: ['https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Courtside', photos: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'North Study', photos: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Structures', photos: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80'] }
];

const albumsGrid = document.getElementById('albums-grid');
const moreButton = document.getElementById('albums-more');
const photoGrid = document.getElementById('photo-grid');
const activeTitle = document.getElementById('active-album-title');
const activeMeta = document.getElementById('active-album-meta');
const searchInput = document.getElementById('album-search');

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');

const visibleLimit = 6;
let albums = [...fallbackAlbums];
let filteredAlbums = [...albums];
let showAllAlbums = false;
let activeAlbumIndex = 0;

const sanitizeAlbums = (data) => {
  if (!Array.isArray(data)) return [...fallbackAlbums];
  return data
    .filter((album) => album && typeof album.title === 'string' && Array.isArray(album.photos))
    .map((album) => ({
      title: album.title,
      photos: album.photos.filter((photo) => typeof photo === 'string' && photo.length > 0)
    }))
    .filter((album) => album.photos.length > 0);
};

const loadAlbumsFromGitHub = async () => {
  try {
    const response = await fetch(albumsEndpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load albums from GitHub');
    const githubAlbums = sanitizeAlbums(await response.json());
    if (githubAlbums.length > 0) {
      albums = githubAlbums;
      filteredAlbums = [...albums];
      activeAlbumIndex = 0;
    }
  } catch (error) {
    console.warn('Using fallback albums.', error);
  }

  renderAlbums();
  renderAlbumPreview();
};

const getPhotoMarkup = (url, albumTitle, index) =>
  `<figure class="photo-item"><img src="${url}" alt="${albumTitle} photo ${index + 1}" data-photo="${url}" /></figure>`;

const renderAlbumPreview = () => {
  const activeAlbum = filteredAlbums[activeAlbumIndex];
  if (!activeAlbum || !photoGrid || !activeTitle || !activeMeta) {
    photoGrid.innerHTML = '';
    if (activeTitle) activeTitle.textContent = 'Album Preview';
    if (activeMeta) activeMeta.textContent = 'No album selected';
    return;
  }

  activeTitle.textContent = activeAlbum.title;
  activeMeta.textContent = `${activeAlbum.photos.length} photo${activeAlbum.photos.length === 1 ? '' : 's'}`;
  photoGrid.innerHTML = activeAlbum.photos.map((photo, index) => getPhotoMarkup(photo, activeAlbum.title, index)).join('');

  photoGrid.querySelectorAll('[data-photo]').forEach((image) => {
    image.addEventListener('click', () => openLightbox(image.getAttribute('data-photo')));
  });
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

    card.innerHTML = `<h4>${album.title}</h4><p>${album.photos.length} photo${album.photos.length === 1 ? '' : 's'}</p>`;
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
  const searchTerm = (searchInput?.value || '').trim().toLowerCase();
  filteredAlbums = albums.filter((album) => album.title.toLowerCase().includes(searchTerm));
  activeAlbumIndex = 0;
  showAllAlbums = false;
  renderAlbums();
  renderAlbumPreview();
};

if (searchInput) {
  searchInput.addEventListener('input', runSearch);
}

if (moreButton) {
  moreButton.addEventListener('click', () => {
    showAllAlbums = !showAllAlbums;
    renderAlbums();
  });
}

const openLightbox = (src) => {
  if (!lightbox || !lightboxImage || !src) return;
  lightboxImage.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
};

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

document.querySelectorAll('[data-creative-card]').forEach((card) => {
  const toggle = card.querySelector('.card-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    card.classList.toggle('active');
    toggle.textContent = card.classList.contains('active') ? 'Hide Notes' : 'View Notes';
  });
});

loadAlbumsFromGitHub();
