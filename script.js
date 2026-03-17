const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

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
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

const initialAlbums = [
  {
    title: 'Street Rain',
    photos: [
      'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    title: 'Courtside',
    photos: [
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  { title: 'Quiet Concrete', photos: ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Dusk Terrains', photos: ['https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'North Study', photos: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Texture Notes', photos: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Structures', photos: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80'] },
  { title: 'Field Journal', photos: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'] }
];

const albumsGrid = document.getElementById('albums-grid');
const moreButton = document.getElementById('albums-more');
const photoGrid = document.getElementById('photo-grid');
const activeTitle = document.getElementById('active-album-title');
const activeMeta = document.getElementById('active-album-meta');
const albumNameInput = document.getElementById('album-name');
const albumFilesInput = document.getElementById('album-files');
const createAlbumButton = document.getElementById('create-album');

const visibleLimit = 6;
let albums = [...initialAlbums];
let showAllAlbums = false;
let activeAlbumIndex = 0;

const getPhotoMarkup = (url, albumTitle, index) =>
  `<figure class="photo-item"><img src="${url}" alt="${albumTitle} photo ${index + 1}" /></figure>`;

const renderAlbumPreview = () => {
  const activeAlbum = albums[activeAlbumIndex];
  if (!activeAlbum || !photoGrid || !activeTitle || !activeMeta) {
    return;
  }

  activeTitle.textContent = activeAlbum.title;
  activeMeta.textContent = `${activeAlbum.photos.length} photo${activeAlbum.photos.length === 1 ? '' : 's'}`;
  photoGrid.innerHTML = activeAlbum.photos.map((photo, index) => getPhotoMarkup(photo, activeAlbum.title, index)).join('');
};

const renderAlbums = () => {
  if (!albumsGrid || !moreButton) {
    return;
  }

  albumsGrid.innerHTML = '';

  albums.forEach((album, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'album-card';

    if (!showAllAlbums && index >= visibleLimit) {
      card.classList.add('is-hidden');
    }

    if (index === activeAlbumIndex) {
      card.classList.add('is-active');
    }

    card.innerHTML = `<h4>${album.title}</h4><p>${album.photos.length} photo${album.photos.length === 1 ? '' : 's'}</p>`;
    card.addEventListener('click', () => {
      activeAlbumIndex = index;
      renderAlbums();
      renderAlbumPreview();
    });

    albumsGrid.appendChild(card);
  });

  const shouldShowMore = albums.length > visibleLimit;
  moreButton.classList.toggle('is-visible', shouldShowMore);
  moreButton.textContent = showAllAlbums ? 'Show Less' : 'More Albums';
};

if (moreButton) {
  moreButton.addEventListener('click', () => {
    showAllAlbums = !showAllAlbums;
    renderAlbums();
  });
}

if (createAlbumButton && albumNameInput && albumFilesInput) {
  createAlbumButton.addEventListener('click', () => {
    const title = albumNameInput.value.trim() || `Album ${albums.length + 1}`;
    const files = Array.from(albumFilesInput.files || []);

    if (files.length === 0) {
      return;
    }

    const photoUrls = files.map((file) => URL.createObjectURL(file));
    albums = [{ title, photos: photoUrls }, ...albums];
    activeAlbumIndex = 0;
    showAllAlbums = true;

    albumNameInput.value = '';
    albumFilesInput.value = '';

    renderAlbums();
    renderAlbumPreview();
  });
}

renderAlbums();
renderAlbumPreview();
