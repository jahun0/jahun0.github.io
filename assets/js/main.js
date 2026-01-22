(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated) {
    const lastModified = document.lastModified ? new Date(document.lastModified) : new Date();
    lastUpdated.textContent = lastModified.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const youtubeTiles = document.querySelectorAll('.yt');

  const loadYouTube = (tile) => {
    const videoId = tile.dataset.youtubeId;
    if (!videoId || videoId === 'PUT_VIDEO_ID_HERE' || tile.dataset.loaded === 'true') {
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?si=ZD6pEJG3J6-kYEB4`;
    iframe.width = '560';
    iframe.height = '315';
    iframe.title = 'YouTube video player';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', '');

    tile.innerHTML = '';
    tile.appendChild(iframe);
    tile.dataset.loaded = 'true';
    tile.classList.add('loaded');
  };

  if (youtubeTiles.length) {
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadYouTube(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px 200px 0px' })
      : null;

    youtubeTiles.forEach((tile) => {
      const videoId = tile.dataset.youtubeId;
      const playButton = tile.querySelector('.yt-play');

      if (!videoId || videoId === 'PUT_VIDEO_ID_HERE') {
        tile.classList.add('missing');
        if (playButton) {
          playButton.textContent = 'Add YouTube ID';
          playButton.disabled = true;
        }
        return;
      }

      tile.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg')`;
      tile.style.backgroundSize = 'cover';
      tile.style.backgroundPosition = 'center';

      tile.addEventListener('click', () => loadYouTube(tile));
      if (observer) {
        observer.observe(tile);
      }
    });
  }

  const pubToggle = document.getElementById('pub-toggle');
  const pubSection = document.getElementById('pubs');

  if (pubToggle && pubSection) {
    const pubItems = Array.from(pubSection.querySelectorAll('.pub-item'));
    const threshold = 6;

    const updateYearGroups = () => {
      pubSection.querySelectorAll('.pub-year').forEach((group) => {
        const visibleItems = group.querySelectorAll('.pub-item:not(.is-hidden)').length;
        group.style.display = visibleItems ? '' : 'none';
      });
    };

    const applyFilter = (showAll) => {
      pubItems.forEach((item) => {
        const isSelected = item.dataset.selected === 'true';
        item.classList.toggle('is-hidden', !showAll && !isSelected);
      });
      pubToggle.setAttribute('aria-expanded', String(showAll));
      pubToggle.textContent = showAll ? 'Show selected' : 'Show all';
      updateYearGroups();
    };

    if (pubItems.length <= threshold) {
      pubToggle.style.display = 'none';
    } else {
      applyFilter(false);
      pubToggle.addEventListener('click', () => {
        const showAll = pubToggle.getAttribute('aria-expanded') !== 'true';
        applyFilter(showAll);
      });
    }
  }
})();
