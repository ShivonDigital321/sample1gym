document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeUp 0.8s ease forwards`;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Canvas Sequence Animation for Hero Section
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const context = canvas.getContext('2d');
    const frameCount = 176;
    
    // Setup canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Preload images
    const currentFrame = index => (
      `assets/hero_frames/ezgif-frame-${index.toString().padStart(3, '0')}.png`
    );

    const images = [];
    let loadedImages = 0;

    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
          loadedImages++;
          if(loadedImages === 1) {
            // Draw first frame ASAP
            drawImage(images[0]);
          }
        };
        images.push(img);
    }

    // Draw image covering canvas (object-fit: cover equivalent)
    const drawImage = (img) => {
      if(!img || !img.complete || img.naturalWidth === 0) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio  = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;  
      
      context.clearRect(0,0, canvas.width, canvas.height);
      context.drawImage(img, 0,0, img.width, img.height,
         centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
    };

    // Animation Loop
    let playhead = 0;
    let lastTime = 0;
    const fps = 24; // Desired FPS
    const interval = 1000 / fps;

    const loop = (currentTime) => {
      requestAnimationFrame(loop);
      
      if(loadedImages < frameCount / 4) return; // wait until at least 25% loaded

      const delta = currentTime - lastTime;
      if (delta > interval) {
        playhead = (playhead + 1) % frameCount;
        if(images[playhead]) {
           drawImage(images[playhead]);
        }
        lastTime = currentTime - (delta % interval);
      }
    };

    requestAnimationFrame(loop);
  }

  // Testimonial slider (simple interval)
  const track = document.querySelector('.testimonial-track');
  if(track) {
    // A simple clone and translate animation could be implemented here
    // For simplicity, we can just use CSS keyframes or simple transform
  }
});
