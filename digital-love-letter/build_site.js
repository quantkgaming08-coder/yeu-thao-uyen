const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('c:/Users/NGUYEN ANH QUAN/Downloads/digital-love-letter');

// Re-read clean base from screen_07c5e4ed.html + mapping
const rawHtml = fs.readFileSync(path.join(baseDir, 'screen_07c5e4ed.html'), 'utf8');
const mapping = JSON.parse(fs.readFileSync(path.join(baseDir, 'image_mapping.json'), 'utf8'));

let html = rawHtml;
for (const [url, localPath] of Object.entries(mapping)) {
  html = html.split(url).join(localPath);
}

// 1. Add ID to Hero section and Timeline section for bottom navigation scrolling
html = html.replace(
  '<section class="relative z-10 flex flex-col pt-space-sm items-center text-center">',
  '<section id="hero-section" class="relative z-10 flex flex-col pt-space-sm items-center text-center scroll-mt-20">'
);

html = html.replace(
  '<section class="relative z-10 w-full flex flex-col items-center">',
  '<section id="timeline-section" class="relative z-10 w-full flex flex-col items-center scroll-mt-20">'
);

// 2. Add ID to live days element so it calculates dynamically
html = html.replace(
  '<span class="font-headline-md text-headline-md text-primary font-bold leading-none tracking-tight">696</span>',
  '<span class="font-headline-md text-headline-md text-primary font-bold leading-none tracking-tight" id="live-days">696</span>'
);

// 3. Make the main body center nicely on desktop
html = html.replace(
  '<body class="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-container">',
  '<body class="bg-[#fceef2] font-body-md text-on-surface flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-container items-center">\n<audio id="bg-music" src="audio/mot_doi.mp3" loop preload="auto" playsinline></audio>'
);

html = html.replace(
  '<header class="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(244,172,183,0.3)] pt-safe">',
  '<header class="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(244,172,183,0.3)] pt-safe max-w-md mx-auto border-b border-primary/10">'
);

html = html.replace(
  '<main class="flex flex-col relative w-full pt-16 pb-28 bg-surface min-h-screen">',
  '<main class="flex flex-col relative w-full max-w-md pt-16 pb-28 bg-surface min-h-screen shadow-2xl border-x border-primary/10">'
);

html = html.replace(
  '<nav class="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_-8px_24px_-4px_rgba(244,172,183,0.3)]"',
  '<nav class="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-8px_24px_-4px_rgba(244,172,183,0.3)] max-w-md mx-auto border-t border-primary/10"'
);

// 4. Update the Bottom Navigation hrefs
html = html.replace('data-path="thu-tinh" href="#"', 'data-path="thu-tinh" href="#hero-section"');
html = html.replace('data-path="dem-ngay" href="#"', 'data-path="dem-ngay" href="#timeline-section"');
html = html.replace('data-path="o-khoa" href="#"', 'data-path="o-khoa" href="#secret-lock-section"');
html = html.replace('data-path="album-anh" href="#"', 'data-path="album-anh" href="#album-20-section"');
html = html.replace('data-path="kho-qua-tang" href="#"', 'data-path="kho-qua-tang" id="nav-gift-btn" href="javascript:void(0)"');

// 5. Add Audio Element and Music Toast and Lightbox
const extraModals = `
<!-- Toast notification for music -->
<div id="music-toast" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-surface-container-lowest/95 backdrop-blur-md shadow-xl border border-primary/30 text-primary font-label-sm text-label-sm flex items-center gap-2.5 opacity-0 pointer-events-none transition-all duration-300">
  <span class="material-symbols-outlined text-[20px] text-primary" id="toast-icon">music_note</span>
  <span id="music-toast-text" class="font-semibold">Đang phát: Một Đời • 14 Casper & Bon 💕</span>
</div>

<!-- Photo Lightbox Modal -->
<div id="photo-lightbox" class="fixed inset-0 z-50 bg-inverse-surface/90 backdrop-blur-md flex flex-col items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300">
  <button id="close-lightbox" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-lowest/20 hover:bg-surface-container-lowest/40 text-white flex items-center justify-center transition-colors">
    <span class="material-symbols-outlined text-[24px]">close</span>
  </button>
  <div class="relative max-w-sm w-full bg-surface-container-lowest p-3 pb-5 rounded-2xl shadow-2xl flex flex-col items-center">
    <div class="w-full max-h-[65vh] rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
      <img id="lightbox-img" class="w-full h-full object-contain" src="" alt="">
    </div>
    <p id="lightbox-caption" class="font-headline-sm text-[16px] text-primary italic mt-3 text-center px-2"></p>
    <div class="flex items-center gap-4 mt-2">
      <button id="prev-photo" class="p-2 rounded-full hover:bg-surface-container text-primary">
        <span class="material-symbols-outlined text-[24px]">arrow_back</span>
      </button>
      <span id="photo-counter" class="font-label-sm text-secondary font-bold">1 / 20</span>
      <button id="next-photo" class="p-2 rounded-full hover:bg-surface-container text-primary">
        <span class="material-symbols-outlined text-[24px]">arrow_forward</span>
      </button>
    </div>
  </div>
</div>
`;

// 6. Comprehensive Interactive Logic
const enhancedScript = `
    (function() {
      // 1. DYNAMIC ANNIVERSARY CALCULATOR (Start: Nov 22, 2024 00:00:00)
      const startDate = new Date('2024-11-22T00:00:00+07:00');
      const daysEl = document.getElementById('live-days');
      const hoursEl = document.getElementById('live-hours');
      const minutesEl = document.getElementById('live-minutes');
      const secondsEl = document.getElementById('live-seconds');

      function updateLoveTimer() {
        const now = new Date();
        const diffMs = now.getTime() - startDate.getTime();
        if (diffMs > 0) {
          const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
          const seconds = Math.floor((diffMs / 1000) % 60);

          if (daysEl) daysEl.textContent = totalDays;
          if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
          if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
          if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }
      }
      updateLoveTimer();
      setInterval(updateLoveTimer, 1000);

      // 2. ROMANTIC AMBIENT PETALS GENERATOR
      const petalsContainer = document.getElementById('ambient-petals-container');
      function spawnFloatingPetal() {
        if (!petalsContainer) return;
        const petal = document.createElement('div');
        const icons = ['🌸', '✨', '💕', '🌷', '🤍', '💖'];
        petal.className = 'absolute pointer-events-none select-none text-[16px] opacity-70 transition-all';
        petal.textContent = icons[Math.floor(Math.random() * icons.length)];
        petal.style.left = (Math.random() * 95) + '%';
        petal.style.top = '-20px';
        petal.style.fontSize = (12 + Math.random() * 12) + 'px';
        petalsContainer.appendChild(petal);

        const duration = 6000 + Math.random() * 6000;
        const drift = (Math.random() - 0.5) * 80;
        const spin = (Math.random() - 0.5) * 360;

        petal.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 0.8 },
          { transform: 'translate(' + drift + 'px, 100vh) rotate(' + spin + 'deg)', opacity: 0 }
        ], {
          duration: duration,
          easing: 'linear'
        }).onfinish = () => petal.remove();
      }
      setInterval(spawnFloatingPetal, 1200);

      // 3. BACKGROUND MUSIC: 'MỘT ĐỜI' - 14 CASPER & BON
      // Create or reuse HTMLAudioElement
      let bgAudio = document.getElementById('bg-music');
      if (!bgAudio) {
        bgAudio = new Audio('audio/mot_doi.mp3');
        bgAudio.id = 'bg-music';
        bgAudio.loop = true;
        bgAudio.preload = 'auto';
        document.body.appendChild(bgAudio);
      }
      bgAudio.volume = 1.0;

      const musicBtn = document.querySelector('button[aria-label="Bật nhạc"]');
      const musicNote = musicBtn ? musicBtn.querySelector('.material-symbols-outlined') : null;
      const musicToast = document.getElementById('music-toast');
      const toastText = document.getElementById('music-toast-text');
      const toastIcon = document.getElementById('toast-icon');
      let toastTimer = null;

      function showToast(msg, isPlaying) {
        if (!musicToast) return;
        if (toastText) toastText.textContent = msg;
        if (toastIcon) {
          toastIcon.textContent = isPlaying ? 'volume_up' : 'volume_off';
        }
        musicToast.classList.remove('opacity-0', 'pointer-events-none');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          musicToast.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
      }

      function updateMusicUI(isPlaying) {
        if (!musicBtn || !musicNote) return;
        if (isPlaying) {
          musicBtn.classList.add('bg-primary', 'text-white', 'shadow-lg');
          musicBtn.classList.remove('bg-surface-container-low', 'text-primary');
          musicNote.textContent = 'pause';
          showToast('Đang phát: Một Đời • 14 Casper & Bon 🎶', true);
        } else {
          musicBtn.classList.remove('bg-primary', 'text-white', 'shadow-lg');
          musicBtn.classList.add('bg-surface-container-low', 'text-primary');
          musicNote.textContent = 'music_note';
          showToast('Đã tạm dừng phát nhạc ⏸️', false);
        }
      }

      bgAudio.addEventListener('play', () => updateMusicUI(true));
      bgAudio.addEventListener('pause', () => updateMusicUI(false));
      bgAudio.addEventListener('ended', () => updateMusicUI(false));

      function playMusic() {
        const promise = bgAudio.play();
        if (promise !== undefined) {
          promise.then(() => {
            updateMusicUI(true);
          }).catch(err => {
            console.warn('Autoplay prevented or audio error:', err);
            showToast('Chạm vào nút nốt nhạc để mở bài Một Đời 🎵', false);
          });
        }
      }

      function togglePlayMusic() {
        if (bgAudio.paused) {
          playMusic();
        } else {
          bgAudio.pause();
        }
      }

      if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          togglePlayMusic();
        });
      }

      // Also allow user to tap anywhere once to trigger audio (browser autoplay policy)
      let autoStarted = false;
      function handleFirstInteraction() {
        if (!autoStarted && bgAudio.paused) {
          autoStarted = true;
          playMusic();
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchend', handleFirstInteraction);
      }
      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('touchend', handleFirstInteraction, { once: true });

      // 4. SECRET LOCK INTERACTIVE LOGIC
      let currentPin = [];
      const correctPin = '2211';
      let isUnlocked = false;
      const pinBoxes = [
        document.getElementById('pin-0'),
        document.getElementById('pin-1'),
        document.getElementById('pin-2'),
        document.getElementById('pin-3')
      ];
      const feedback = document.getElementById('lock-feedback');
      const modal = document.getElementById('gift-modal');
      const drawer = document.getElementById('gift-drawer-content');
      const lockIcon = document.getElementById('lock-icon');

      function updatePinUI() {
        pinBoxes.forEach((box, idx) => {
          if (box) {
            box.textContent = currentPin[idx] !== undefined ? currentPin[idx] : '·';
            if (currentPin[idx] !== undefined) {
              box.classList.add('bg-primary-fixed', 'text-on-primary-fixed', 'scale-105');
              box.classList.remove('bg-surface-container-lowest');
            } else {
              box.classList.remove('bg-primary-fixed', 'text-on-primary-fixed', 'scale-105');
              box.classList.add('bg-surface-container-lowest');
            }
          }
        });
      }

      function triggerUnlockSuccess() {
        isUnlocked = true;
        if (feedback) {
          feedback.textContent = 'Mật mã 22/11 chính xác! Chúc mừng em yêu 💖';
          feedback.classList.remove('opacity-0', 'text-error');
          feedback.classList.add('opacity-100', 'text-primary');
        }
        if (lockIcon) {
          lockIcon.textContent = 'lock_open_right';
          lockIcon.classList.add('text-secondary');
        }
        createHeartBurst();
        setTimeout(openModal, 600);
      }

      function checkCode() {
        if (currentPin.join('') === correctPin) {
          triggerUnlockSuccess();
        } else {
          if (feedback) {
            feedback.textContent = 'Chưa đúng rồi! Gợi ý là ngày định mệnh 22/11 em nhé 💕';
            feedback.classList.remove('opacity-0', 'text-primary');
            feedback.classList.add('opacity-100', 'text-error');
          }
          currentPin = [];
          setTimeout(updatePinUI, 500);
        }
      }

      document.querySelectorAll('.keypad-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-val');
          const action = btn.getAttribute('data-action');

          if (val && currentPin.length < 4) {
            currentPin.push(val);
            updatePinUI();
            if (currentPin.length === 4) {
              setTimeout(checkCode, 200);
            }
          } else if (action === 'backspace') {
            currentPin.pop();
            updatePinUI();
            if (feedback) feedback.classList.add('opacity-0');
          } else if (action === 'unlock') {
            if (currentPin.length === 4) {
              checkCode();
            } else {
              if (feedback) {
                feedback.textContent = 'Vui lòng nhập đủ 4 chữ số mật mã (2211) nhé!';
                feedback.classList.remove('opacity-0');
              }
            }
          }
        });
      });

      const quickFillBtn = document.getElementById('quick-fill-btn');
      if (quickFillBtn) {
        quickFillBtn.addEventListener('click', () => {
          currentPin = ['2', '2', '1', '1'];
          updatePinUI();
          triggerUnlockSuccess();
        });
      }

      function openModal() {
        if (modal && drawer) {
          modal.classList.remove('opacity-0', 'pointer-events-none');
          drawer.classList.remove('translate-y-full');
        }
      }

      function closeModal() {
        if (modal && drawer) {
          drawer.classList.add('translate-y-full');
          setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
          }, 200);
        }
      }

      const closeBtn = document.getElementById('close-modal-btn');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }

      // Gift Coupon selection
      const coupons = document.querySelectorAll('.gift-coupon');
      const claimBtn = document.getElementById('claim-gift-btn');
      const giftAlert = document.getElementById('gift-alert-message');

      coupons.forEach(coupon => {
        coupon.addEventListener('click', () => {
          coupons.forEach(c => {
            c.classList.remove('bg-primary-fixed', 'shadow-md');
            c.classList.add('bg-surface-container-lowest');
            const check = c.querySelector('.gift-check');
            if (check) {
              check.textContent = 'radio_button_unchecked';
              check.classList.remove('text-primary');
              check.classList.add('text-outline');
            }
          });
          coupon.classList.remove('bg-surface-container-lowest');
          coupon.classList.add('bg-primary-fixed', 'shadow-md');
          const check = coupon.querySelector('.gift-check');
          if (check) {
            check.textContent = 'check_circle';
            check.classList.remove('text-outline');
            check.classList.add('text-primary');
          }
          if (claimBtn) {
            claimBtn.removeAttribute('disabled');
            claimBtn.classList.remove('bg-outline/40', 'cursor-not-allowed');
            claimBtn.classList.add('bg-gradient-to-r', 'from-primary', 'to-tertiary', 'text-on-primary', 'cursor-pointer');
          }
        });
      });

      if (claimBtn) {
        claimBtn.addEventListener('click', () => {
          if (giftAlert) {
            giftAlert.classList.remove('hidden');
            createHeartBurst();
          }
        });
      }

      // Nav gift button
      const navGiftBtn = document.getElementById('nav-gift-btn');
      if (navGiftBtn) {
        navGiftBtn.addEventListener('click', () => {
          if (isUnlocked) {
            openModal();
          } else {
            const lockSection = document.getElementById('secret-lock-section');
            if (lockSection) lockSection.scrollIntoView({ behavior: 'smooth' });
            if (feedback) {
              feedback.textContent = 'Hãy giải mã ổ khóa 22/11 để mở rương quà nhé! 🎁';
              feedback.classList.remove('opacity-0');
            }
          }
        });
      }

      // 5. PHOTO ALBUM LIGHTBOX LOGIC
      const photos = [];
      document.querySelectorAll('#album-20-section img').forEach((img, index) => {
        const parent = img.closest('.flex-col');
        const caption = parent ? parent.querySelector('p').textContent : 'Kỷ niệm ' + (index + 1);
        photos.push({ src: img.src, caption: caption });

        parent.style.cursor = 'pointer';
        parent.addEventListener('click', () => openLightbox(index));
      });

      const lightbox = document.getElementById('photo-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxCaption = document.getElementById('lightbox-caption');
      const photoCounter = document.getElementById('photo-counter');
      const closeLightboxBtn = document.getElementById('close-lightbox');
      const prevBtn = document.getElementById('prev-photo');
      const nextBtn = document.getElementById('next-photo');
      let currentPhotoIndex = 0;

      function openLightbox(index) {
        currentPhotoIndex = index;
        lightboxImg.src = photos[index].src;
        lightboxCaption.textContent = photos[index].caption;
        photoCounter.textContent = (index + 1) + ' / ' + photos.length;
        lightbox.classList.remove('opacity-0', 'pointer-events-none');
      }

      function closeLightbox() {
        lightbox.classList.add('opacity-0', 'pointer-events-none');
      }

      if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
      if (lightbox) {
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
          openLightbox(currentPhotoIndex);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
          openLightbox(currentPhotoIndex);
        });
      }

      // 6. HEART BURST CONFETTI
      function createHeartBurst() {
        const container = document.getElementById('ambient-petals-container');
        if (!container) return;
        for (let i = 0; i < 20; i++) {
          const heart = document.createElement('div');
          heart.className = 'absolute text-primary select-none pointer-events-none text-[22px] transition-all duration-1000';
          heart.innerHTML = ['💖', '🌸', '✨', '💕', '🌷', '🥰'][Math.floor(Math.random() * 6)];
          heart.style.left = (Math.random() * 80 + 10) + '%';
          heart.style.top = (window.scrollY + window.innerHeight * 0.45) + 'px';
          container.appendChild(heart);

          const destX = (Math.random() - 0.5) * 200;
          const destY = -Math.random() * 250 - 50;

          requestAnimationFrame(() => {
            heart.style.transform = 'translate(' + destX + 'px, ' + destY + 'px) scale(1.5)';
            heart.style.opacity = '0';
          });

          setTimeout(() => heart.remove(), 1200);
        }
      }
    })();
`;

// Replace script in index.html
const scriptStart = html.indexOf('<script>\n    (function() {');
const scriptEnd = html.indexOf('</script>\n</div></main>');
if (scriptStart !== -1 && scriptEnd !== -1) {
  html = html.substring(0, scriptStart) + '<script>' + enhancedScript + html.substring(scriptEnd);
}

// Insert Modals HTML before </body>
html = html.replace('</body></html>', extraModals + '\n</body></html>');

fs.writeFileSync(path.join(baseDir, 'index.html'), html, 'utf8');
console.log('Finished updating digital love letter with verified audio initialization!');
