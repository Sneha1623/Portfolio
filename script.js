/* ==========================================================================
   SNEHA SUDHA BEHERA - REDESIGNED PORTFOLIO INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. MINIMAL NAVBAR & MOBILE HAMBURGER MENU
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. RESUME PREVIEW MODAL HANDLER
     -------------------------------------------------------------------------- */
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeX = document.getElementById('close-modal-x');
  const closeBtn = document.getElementById('close-modal-btn');
  const printBtn = document.getElementById('print-resume-action');
  const resumeModal = document.getElementById('resume-modal');

  function showModal() {
    if (resumeModal) {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideModal() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', showModal);
  if (closeX) closeX.addEventListener('click', hideModal);
  if (closeBtn) closeBtn.addEventListener('click', hideModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) hideModal();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* --------------------------------------------------------------------------
     3. LIVE WI-FI CSI WAVEFORM SIMULATOR CANVAS (RESEARCH SECTION)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('csiWaveCanvas');
  const toggleBtn = document.getElementById('toggle-sim-btn');
  const statusLabel = document.getElementById('sim-status-label');

  let motionActive = true;
  let phase = 0;

  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 480;
        canvas.height = 170;
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function renderCSIWaveform() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Sub-carrier grid lines
      ctx.strokeStyle = 'rgba(245, 239, 228, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 35) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Draw 3 distinct sub-carrier phase curves
      const channels = [
        { color: '#B9623D', freq: 0.02, amp: motionActive ? 38 : 12, speed: 0.05 },
        { color: '#65705E', freq: 0.035, amp: motionActive ? 28 : 8, speed: 0.03 },
        { color: '#D69A91', freq: 0.015, amp: motionActive ? 48 : 14, speed: 0.06 }
      ];

      channels.forEach(ch => {
        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 2;

        for (let x = 0; x < w; x++) {
          const noise = motionActive ? Math.sin(x * 0.08 + phase * 2.5) * 7 : 0;
          const y = midY + Math.sin(x * ch.freq + phase * ch.speed) * ch.amp + noise;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      phase += 0.8;
      requestAnimationFrame(renderCSIWaveform);
    }

    renderCSIWaveform();

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        motionActive = !motionActive;
        if (motionActive) {
          toggleBtn.textContent = 'Simulate Static Environment';
          if (statusLabel) {
            statusLabel.textContent = 'HUMAN MOTION DETECTED';
            statusLabel.style.color = '#B9623D';
          }
        } else {
          toggleBtn.textContent = 'Simulate Human Motion';
          if (statusLabel) {
            statusLabel.textContent = 'STATIC ENVIRONMENT (NO MOTION)';
            statusLabel.style.color = '#65705E';
          }
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. GENTLE SCROLL REVEAL (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.project-editorial-block, .timeline-row, .skill-column, .rec-card, .contact-box-wrapper, .about-asymmetric-layout'
  );

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealTargets.forEach(el => observer.observe(el));

  /* --------------------------------------------------------------------------
     5. ACTIVE NAV MENU HIGHLIGHT ON SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollPos = window.pageYOffset;
    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 90;
      const secId = sec.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links-wrapper a[href*=${secId}]`);

      if (activeLink) {
        if (scrollPos > secTop && scrollPos <= secTop + secHeight) {
          activeLink.style.color = 'var(--color-terracotta)';
        } else {
          activeLink.style.color = '';
        }
      }
    });
  });

});
