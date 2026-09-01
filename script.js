document.addEventListener("DOMContentLoaded", () => {
  const navBtns = document.querySelectorAll(".nav-btn");
  const contentSections = document.querySelectorAll(".content-section, #p5-container");
  const backBtns = document.querySelectorAll(".back-bar");
  const fadeOverlay = document.getElementById("fade-overlay");
  const sidebar = document.getElementById("sidebar");
  const contentArea = document.getElementById("content-area");
  
  // Helper to trigger fade
  function triggerFade(callback) {
    fadeOverlay.classList.add("fade-active");
    setTimeout(() => {
      callback();
      fadeOverlay.classList.remove("fade-active");
    }, 500); // Wait for fade in (0.5s)
  }

  // Handle Navigation Click
  navBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return; // Allow default link behavior

      e.preventDefault();

      triggerFade(() => {
        // Hide all sections
        contentSections.forEach(sec => sec.classList.remove("active-section"));
        
        // Pause p5 if it exists globally
        if (typeof window.noLoop === 'function') {
          window.noLoop();
        }

        // Show target section
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
          targetSection.classList.add("active-section");
        }

        // Handle mobile view transition
        if (window.innerWidth <= 768) {
          sidebar.style.display = "none";
          contentArea.style.display = "block";
        }
      });
    });
  });

  // Handle Back Button Click (both desktop and mobile can use this)
  backBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      triggerFade(() => {
        // Hide all detail sections
        contentSections.forEach(sec => sec.classList.remove("active-section"));
        
        // Show home section (p5-container) on desktop
        const homeSection = document.getElementById("p5-container");
        if(homeSection) {
          homeSection.classList.add("active-section");
          // Resume p5
          if (typeof window.loop === 'function') {
            window.loop();
          }
        }

        // On mobile, hide content area and show sidebar again
        if (window.innerWidth <= 768) {
          sidebar.style.display = "flex";
          contentArea.style.display = "none";
        }
      });
    });
  });

  // Handle window resize to reset mobile states if switching to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.style.display = "flex";
      contentArea.style.display = "block";
    } else {
      // If we are on home on mobile, hide content
      const homeActive = document.getElementById("p5-container").classList.contains("active-section");
      if (homeActive) {
        sidebar.style.display = "flex";
        contentArea.style.display = "none";
      } else {
        sidebar.style.display = "none";
        contentArea.style.display = "block";
      }
    }
  });

  // Dark Mode Toggle Logic
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  
  // Preload dark mode images
  const imgsToSwap = document.querySelectorAll("img[data-dark-src]");
  imgsToSwap.forEach(img => {
    const darkSrc = img.getAttribute("data-dark-src");
    if (darkSrc) {
      const preloadImg = new Image();
      preloadImg.src = darkSrc;
    }
  });

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDarkMode = document.body.classList.contains("dark-mode");
      
      // Swap images
      imgsToSwap.forEach(img => {
        if (!img.hasAttribute("data-original-src")) {
          img.setAttribute("data-original-src", img.src);
        }
        
        if (isDarkMode) {
          img.src = img.getAttribute("data-dark-src");
        } else {
          img.src = img.getAttribute("data-original-src");
        }
      });
    });
  }
  
  // Initial setup for mobile
  if (window.innerWidth <= 768) {
    sidebar.style.display = "flex";
    contentArea.style.display = "none";
  }

  // Swipe-right to go back (touch + trackpad)
  let touchStartX = 0;
  let touchStartY = 0;

  contentArea.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  contentArea.addEventListener("touchend", (e) => {
    const deltaX = e.changedTouches[0].screenX - touchStartX;
    const deltaY = Math.abs(e.changedTouches[0].screenY - touchStartY);
    // Swipe right at least 50px, and more horizontal than vertical
    if (deltaX > 50 && deltaX > deltaY) {
      goBack();
    }
  }, { passive: true });

  // Extract back logic into a reusable function
  function goBack() {
    // Only trigger if a content section (not home) is active
    const homeSection = document.getElementById("p5-container");
    if (homeSection && homeSection.classList.contains("active-section")) return;

    triggerFade(() => {
      contentSections.forEach(sec => sec.classList.remove("active-section"));
      if (homeSection) {
        homeSection.classList.add("active-section");
        if (typeof window.loop === 'function') {
          window.loop();
        }
      }
      if (window.innerWidth <= 768) {
        sidebar.style.display = "flex";
        contentArea.style.display = "none";
      }
    });
  }

  // Re-wire existing back buttons to use the same function
  backBtns.forEach(btn => {
    // Remove old listeners by cloning (clean approach)
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", goBack);
  });
});
