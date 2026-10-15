document.addEventListener("DOMContentLoaded", () => {
  // Determine relative paths based on depth
  const inPages = window.location.pathname.includes("/pages/");
  const root = inPages ? "../" : "";
  const pagesPrefix = inPages ? "" : "pages/";

  // Helper to build URL for data-page attributes
  function getUrl(page, hash) {
    let href;
    if (page === "index") {
      href = `${root}index.html`;
    } else if (page === "404") {
      href = `${root}404.html`;
    } else {
      href = `${pagesPrefix}${page}.html`;
    }
    return hash ? `${href}#${hash}` : href;
  }

  // ── 0. Thematic Legal Chambers Preloader (2.0s Duration) ─────────
  function initPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    // Ensure body scroll is locked during preloading
    document.body.classList.add("preloader-active");

    const barFill = document.getElementById("preloaderBarFill");
    const counter = document.getElementById("preloaderCounter");
    const statusText = document.getElementById("preloaderStatusText");

    const duration = 2000; // 2.0 seconds exact duration
    const startTime = performance.now();

    const statusMilestones = [
      { threshold: 0.0, text: "INITIALISING SECURE LEGAL PRIVILEGE" },
      { threshold: 0.25, text: "AUTHENTICATING SRA CREDENTIALS #589214" },
      { threshold: 0.55, text: "CONVENING SENIOR PARTNER COUNSEL" },
      { threshold: 0.85, text: "SYNCHRONISING CHAMBERS DOSSIERS" },
      { threshold: 0.98, text: "CHAMBERS ACCESS GRANTED • WELCOME" },
    ];

    let currentMilestoneIndex = 0;
    let isFinished = false;

    function finish() {
      if (isFinished) return;
      isFinished = true;

      if (barFill) barFill.style.width = "100%";
      if (counter) counter.textContent = "100%";
      if (statusText) {
        statusText.textContent = "CHAMBERS ACCESS GRANTED • WELCOME";
        statusText.style.opacity = "1";
      }

      preloader.classList.add("preloader-complete");

      // Brief elegant celebration before smooth reveal transition (160ms)
      setTimeout(() => {
        preloader.classList.add("preloader-finished");
        document.body.classList.remove("preloader-active");

        // Clean up from render tree once transition ends
        setTimeout(() => {
          preloader.style.display = "none";
          preloader.setAttribute("aria-hidden", "true");
          window.dispatchEvent(new CustomEvent("preloaderDismissed"));
        }, 700);
      }, 160);
    }

    function step(now) {
      if (isFinished) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const percent = Math.min(Math.floor(progress * 100), 100);

      if (barFill) {
        barFill.style.width = `${percent}%`;
      }
      if (counter) {
        counter.textContent = `${percent}%`;
      }

      // Check milestones
      for (let i = statusMilestones.length - 1; i >= 0; i--) {
        if (progress >= statusMilestones[i].threshold) {
          if (currentMilestoneIndex !== i) {
            currentMilestoneIndex = i;
            if (statusText) {
              statusText.style.opacity = "0.2";
              setTimeout(() => {
                if (statusText && !isFinished) {
                  statusText.textContent = statusMilestones[i].text;
                  statusText.style.opacity = "1";
                }
              }, 90);
            }
          }
          break;
        }
      }

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        finish();
      }
    }

    requestAnimationFrame(step);

    // Safeguard: tab backgrounded or low priority RAF fallback
    setTimeout(() => {
      if (!isFinished) finish();
    }, 2800);
  }

  // Run preloader immediately
  initPreloader();

  // Fallback HTML definitions in case fetch fails under file:// protocol
  const fallbackHeaderHtml = `
    <!-- Topbar -->
    <div class="site-topbar d-none d-lg-block">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-2">
          <div class="topbar-info d-flex align-items-center gap-4 text-white-50 fs-7">
            <span><i class="fa-solid fa-location-dot text-gold me-2"></i>45 Bedford Row, Holborn, London WC1R 4LL, UK</span>
            <span><i class="fa-solid fa-phone text-gold me-2"></i><a href="tel:+919876543210" class="text-white text-decoration-none">+91 9876543210</a></span>
            <span><i class="fa-solid fa-envelope text-gold me-2"></i><a href="mailto:contact@stacklylegal.co.uk" class="text-white text-decoration-none">contact@stacklylegal.co.uk</a></span>
          </div>
          <div class="topbar-social d-flex align-items-center gap-3">
            <div class="social-links-header d-flex gap-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="social-icon-sm"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon-sm"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon-sm"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon-sm"><i class="fa-brands fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Main Sticky Header -->
    <header class="site-header" id="mainHeader">
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-dark p-0 d-flex justify-content-between align-items-center">
          <a class="navbar-brand d-flex align-items-center gap-3" href="" id="headerBrandLink">
            <img src="" id="headerLogoImg" alt="Stackly Legal Consultation" class="header-logo-img">
          </a>
          <div class="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarDesktop">
            <ul class="navbar-nav align-items-center gap-4">
              <li class="nav-item"><a class="nav-link custom-nav-link" href="" data-page="index">Home</a></li>
              <li class="nav-item"><a class="nav-link custom-nav-link" href="" data-page="about">About Us</a></li>
              <li class="nav-item"><a class="nav-link custom-nav-link" href="" data-page="services">Services</a></li>
              <li class="nav-item"><a class="nav-link custom-nav-link" href="" data-page="portfolio">Case Studies</a></li>
              <li class="nav-item"><a class="nav-link custom-nav-link" href="" data-page="blog">Legal Insights</a></li>
              <li class="nav-item"><a class="nav-link custom-nav-link" href="" data-page="contact">Contact</a></li>
              <li class="nav-item"><a class="nav-link custom-nav-link text-gold fw-semibold" href="" data-page="dashboard"><i class="fa-solid fa-chart-pie me-1"></i>Dashboard</a></li>
            </ul>
          </div>
          <div class="header-action-wrap d-flex align-items-center gap-3">
            <a href="" data-page="login" class="btn btn-outline-gold btn-header-cta d-none d-xl-inline-flex align-items-center gap-2">
              <i class="fa-solid fa-lock fs-8"></i>
              <span>Portal</span>
            </a>
            <button class="navbar-toggler mobile-menu-toggle border-0 p-2" type="button" id="mobileMenuOpenBtn" aria-label="Toggle navigation">
              <span class="menu-bar-icon"><span></span><span></span><span></span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
    <!-- Full Screen Mobile Overlay Menu -->
    <div class="mobile-nav-fullscreen" id="mobileNavOverlay">
      <div class="mobile-nav-header d-flex justify-content-between align-items-center container">
        <a class="d-flex align-items-center gap-2 text-decoration-none" href="" id="mobileBrandLink">
          <img src="" id="mobileLogoImg" alt="Stackly Legal" class="mobile-logo-img">
          <span class="text-white fw-bold fs-5">STACKLY <span class="text-gold">LEGAL</span></span>
        </a>
        <button class="mobile-nav-close-btn" id="mobileMenuCloseBtn" aria-label="Close menu">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="mobile-nav-body container">
        <ul class="mobile-nav-list list-unstyled">
          <li><a href="" data-page="index" class="mobile-nav-link"><i class="fa-solid fa-chevron-right me-2 text-gold"></i>Home</a></li>
          <li><a href="" data-page="about" class="mobile-nav-link"><i class="fa-solid fa-chevron-right me-2 text-gold"></i>About Us</a></li>
          <li><a href="" data-page="services" class="mobile-nav-link"><i class="fa-solid fa-chevron-right me-2 text-gold"></i>Legal Services</a></li>
          <li><a href="" data-page="portfolio" class="mobile-nav-link"><i class="fa-solid fa-chevron-right me-2 text-gold"></i>Case Studies &amp; Track Record</a></li>
          <li><a href="" data-page="blog" class="mobile-nav-link"><i class="fa-solid fa-chevron-right me-2 text-gold"></i>Legal Insights &amp; Articles</a></li>
          <li><a href="" data-page="contact" class="mobile-nav-link"><i class="fa-solid fa-chevron-right me-2 text-gold"></i>Contact &amp; Location</a></li>
          <li><a href="" data-page="dashboard" class="mobile-nav-link text-gold"><i class="fa-solid fa-gauge-high me-2 text-gold"></i>Chambers Dashboard</a></li>
          <li><a href="" data-page="login" class="mobile-nav-link text-gold"><i class="fa-solid fa-arrow-right-to-bracket me-2 text-gold"></i>Client Portal (Sign In)</a></li>
        </ul>
        <div class="mobile-nav-footer mt-4 pt-4 border-top border-secondary">
          <div class="d-flex flex-column gap-2 text-white-50 fs-7 mb-4">
            <div><i class="fa-solid fa-phone text-gold me-2"></i><a href="tel:+919876543210" class="text-white text-decoration-none">+91 9876543210</a></div>
            <div><i class="fa-solid fa-envelope text-gold me-2"></i><a href="mailto:contact@stacklylegal.co.uk" class="text-white text-decoration-none">contact@stacklylegal.co.uk</a></div>
            <div><i class="fa-solid fa-location-dot text-gold me-2"></i>45 Bedford Row, Holborn, London WC1R 4LL, UK</div>
          </div>
          <div class="d-flex gap-3 mb-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-icon-sm" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-icon-sm" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-icon-sm" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-icon-sm" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
          <a href="" data-page="contact" class="btn btn-gold w-100 py-3 text-center fw-bold">Request Private Consultation</a>
        </div>
      </div>
    </div>
  `;

  const fallbackFooterHtml = `
    <footer class="site-footer" id="siteFooter">
      <div class="footer-top py-5">
        <div class="container">
          <div class="row g-5">
            <div class="col-lg-4 col-md-6 footer-brand-col">
              <div class="footer-logo-wrap mb-3">
                <a href="" data-page="index" class="d-flex align-items-center gap-3 text-decoration-none">
                  <img src="" id="footerLogoImg" alt="Stackly Legal Consultation" class="footer-logo-img">
                  <div class="brand-text-wrap d-flex flex-column">
                    <span class="brand-title text-white">STACKLY <span class="text-gold">LEGAL</span></span>
                    <span class="brand-subtitle text-white-50">SOLICITORS &amp; LEGAL CONSULTANTS</span>
                  </div>
                </a>
              </div>
              <p class="footer-about-text text-white-50 mb-4">
                Stackly Legal Consultation is a premier UK and international legal advisory firm. Providing strategic counsel across corporate transactions, commercial litigation, high-net-worth estate preservation, and regulatory compliance.
              </p>
              <div class="compliance-badge-row d-flex align-items-center gap-3 mb-4">
                <div class="sra-badge p-2 px-3 rounded">
                  <i class="fa-solid fa-scale-balanced text-gold me-2"></i>
                  <span class="text-white-50 fs-8">Authorised &amp; Regulated by the Solicitors Regulation Authority</span>
                </div>
              </div>
              <div class="footer-social-links d-flex gap-2">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="social-icon-btn"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon-btn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon-btn"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon-btn"><i class="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div class="col-lg-3 col-md-6 footer-nav-col">
              <h4 class="footer-heading text-white mb-4">Practice Areas</h4>
              <ul class="footer-links-list list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="" data-page="services" data-hash="corporate"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Corporate &amp; M&amp;A Law</a></li>
                <li><a href="" data-page="services" data-hash="litigation"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Commercial Dispute Resolution</a></li>
                <li><a href="" data-page="services" data-hash="real-estate"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Real Estate &amp; Construction</a></li>
                <li><a href="" data-page="services" data-hash="ip"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Intellectual Property Protection</a></li>
                <li><a href="" data-page="services" data-hash="employment"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Executive Employment Law</a></li>
                <li><a href="" data-page="services" data-hash="private-client"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Private Wealth &amp; Family Trust</a></li>
                <li><a href="" data-page="services" data-hash="compliance"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Regulatory &amp; White Collar Defence</a></li>
              </ul>
            </div>
            <div class="col-lg-2 col-md-6 footer-nav-col">
              <h4 class="footer-heading text-white mb-4">Firm Overview</h4>
              <ul class="footer-links-list list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="" data-page="about"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>About the Firm</a></li>
                <li><a href="" data-page="about" data-hash="partners"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Senior Partners</a></li>
                <li><a href="" data-page="portfolio"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Track Record</a></li>
                <li><a href="" data-page="blog"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Legal Precedents</a></li>
                <li><a href="" data-page="contact"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Fee Structures</a></li>
                <li><a href="" data-page="contact"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Contact Solicitors</a></li>
                <li><a href="" data-page="login"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Client Portal</a></li>
                <li><a href="" data-page="register"><i class="fa-solid fa-chevron-right text-gold me-2 fs-8"></i>Register Account</a></li>
              </ul>
            </div>
            <div class="col-lg-3 col-md-6 footer-contact-col">
              <h4 class="footer-heading text-white mb-4">London Headquarters</h4>
              <div class="footer-contact-details d-flex flex-column gap-3 text-white-50 mb-4">
                <div class="d-flex align-items-start gap-3">
                  <i class="fa-solid fa-location-dot text-gold mt-1"></i>
                  <span>45 Bedford Row, Holborn, London WC1R 4LL, United Kingdom</span>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <i class="fa-solid fa-phone text-gold"></i>
                  <a href="tel:+919876543210" class="text-white text-decoration-none">+91 9876543210</a>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <i class="fa-solid fa-envelope text-gold"></i>
                  <a href="mailto:contact@stacklylegal.co.uk" class="text-white text-decoration-none">contact@stacklylegal.co.uk</a>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <i class="fa-solid fa-clock text-gold"></i>
                  <span>Mon – Fri: 8:30 AM – 6:30 PM (GMT)</span>
                </div>
              </div>
              <div class="footer-newsletter">
                <h6 class="text-white mb-2 fs-7 text-uppercase fw-bold">Legal Briefing Dispatch</h6>
                <p class="text-white-50 fs-8 mb-2">Receive curated statutory alerts and landmark High Court analysis directly.</p>
                <form class="newsletter-form d-flex gap-2" id="footerNewsletterForm" onsubmit="event.preventDefault(); const inPages = window.location.pathname.toLowerCase().includes('/pages/'); window.location.href = inPages ? '../404.html' : '404.html';">
                  <input type="email" class="form-control form-control-sm newsletter-input" placeholder="Work email address" required>
                  <button type="submit" class="btn btn-gold btn-sm px-3" aria-label="Subscribe to legal newsletter"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom py-3">
        <div class="container">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white-50 fs-7">
            <p class="mb-0 text-center text-md-start">
              &copy; <span id="currentYearSpan"></span> Stackly Legal Consultation. All Rights Reserved. Professional Legal Indemnity Insurance Verified.
            </p>
            <div class="footer-legal-links d-flex gap-3">
              <a href="#" class="text-white-50 text-decoration-none">Privacy &amp; Cookies</a>
              <span class="text-white-50">&bull;</span>
              <a href="#" class="text-white-50 text-decoration-none">Terms of Engagement</a>
              <span class="text-white-50">&bull;</span>
              <a href="#" class="text-white-50 text-decoration-none">SRA Transparency Rules</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <button id="scrollTopBtn" class="scroll-top-btn" aria-label="Scroll back to top">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  `;

  // Component loader with fetch + instant fallback
  function loadComponent(id, filePath, fallbackHtml, onDone) {
    const el = document.getElementById(id);
    if (!el) return;

    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Component load error " + filePath);
        return res.text();
      })
      .then((html) => {
        el.innerHTML = html;
        if (onDone) onDone();
      })
      .catch(() => {
        // Fallback for file:// protocol or offline environment
        el.innerHTML = fallbackHtml;
        if (onDone) onDone();
      });
  }

  // Bind dynamic links and logo paths
  function resolveComponentLinks(container) {
    if (!container) return;

    // Anchor URLs with data-page
    container.querySelectorAll("[data-page]").forEach((el) => {
      const page = el.getAttribute("data-page");
      const hash = el.getAttribute("data-hash") || "";
      el.setAttribute("href", getUrl(page, hash));
    });

    // Logo image paths
    const logoPath = `${root}assets/images/logoStackly.webp`;
    ["headerLogoImg", "mobileLogoImg", "footerLogoImg"].forEach((id) => {
      const img = container.querySelector(`#${id}`);
      if (img) img.setAttribute("src", logoPath);
    });

    // Brand links
    ["headerBrandLink", "mobileBrandLink"].forEach((id) => {
      const link = container.querySelector(`#${id}`);
      if (link) link.setAttribute("href", getUrl("index"));
    });
  }

  // Determine current active page
  function markActiveNavLinks() {
    let current = "index";
    const path = window.location.pathname.toLowerCase();
    if (path.includes("about.html")) current = "about";
    else if (path.includes("services.html")) current = "services";
    else if (path.includes("portfolio.html")) current = "portfolio";
    else if (path.includes("blog.html")) current = "blog";
    else if (path.includes("contact.html")) current = "contact";

    document
      .querySelectorAll(`.custom-nav-link[data-page="${current}"]`)
      .forEach((a) => {
        a.classList.add("active");
      });
    document
      .querySelectorAll(`.mobile-nav-link[data-page="${current}"]`)
      .forEach((a) => {
        a.classList.add("active");
      });
  }

  // Header functionality: Sticky on scroll + Mobile Fullscreen Menu
  function initHeader() {
    const headerContainer = document.getElementById("header-placeholder");
    resolveComponentLinks(headerContainer);
    markActiveNavLinks();

    const header = document.getElementById("mainHeader");
    const topbar = document.querySelector(".site-topbar");

    // Offset body so content isn't hidden under fixed header
    function updateBodyOffset() {
      document.body.style.paddingTop = headerContainer.offsetHeight + "px";
    }
    updateBodyOffset();
    window.addEventListener("resize", updateBodyOffset, { passive: true });

    // Sticky Header Scroll Handler
    function handleScroll() {
      if (!header) return;
      const shouldStick = window.scrollY > 40;
      if (shouldStick) {
        header.classList.add("is-sticky");
      } else {
        header.classList.remove("is-sticky");
      }
      updateBodyOffset();
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mobile Fullscreen Menu Controls
    const mobileMenuOpenBtn = document.getElementById("mobileMenuOpenBtn");
    const mobileMenuCloseBtn = document.getElementById("mobileMenuCloseBtn");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");

    function openMobileMenu() {
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }

    function closeMobileMenu() {
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    if (mobileMenuOpenBtn) {
      mobileMenuOpenBtn.addEventListener("click", openMobileMenu);
    }
    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener("click", closeMobileMenu);
    }

    // Close mobile menu when any link is clicked
    if (mobileNavOverlay) {
      mobileNavOverlay.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });
    }
  }

  // Footer functionality: Scroll To Top button + Current Year
  function initFooter() {
    const footerContainer = document.getElementById("footer-placeholder");
    resolveComponentLinks(footerContainer);

    // Current Year
    const yearSpan = document.getElementById("currentYearSpan");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > 350) {
            scrollTopBtn.classList.add("visible");
          } else {
            scrollTopBtn.classList.remove("visible");
          }
        },
        { passive: true },
      );

      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    // Footer Newsletter Form: redirect to 404 page on submit
    const footerNewsletterForm =
      (footerContainer && footerContainer.querySelector(".newsletter-form")) ||
      document.querySelector(".site-footer .newsletter-form") ||
      document.getElementById("footerNewsletterForm");

    if (footerNewsletterForm) {
      footerNewsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!footerNewsletterForm.checkValidity()) {
          footerNewsletterForm.reportValidity();
          return;
        }
        window.location.href = getUrl("404");
      });
    }
  }

  // Load Header and Footer
  loadComponent(
    "header-placeholder",
    `${root}pages/components/header.html`,
    fallbackHeaderHtml,
    initHeader,
  );

  loadComponent(
    "footer-placeholder",
    `${root}pages/components/footer.html`,
    fallbackFooterHtml,
    initFooter,
  );

  // ── General Interactive Utilities ──────────────────────────────

  // 1. Interactive Assessment / Fee Calculator on Home Page
  const calculatorForm = document.getElementById("legalAssessmentForm");
  if (calculatorForm) {
    calculatorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const serviceType = document.getElementById("calcServiceType").value;
      const urgency = document.getElementById("calcUrgency").value;
      const jurisdiction = document.getElementById("calcJurisdiction").value;
      const resultBox = document.getElementById("calcResultBox");

      let turnaround = "Within 24 Hours";
      let feeScope = "Standard Fixed-Fee Intake Review: £350 + VAT";
      let seniorCounsel = "Assigned Partner & Senior Associate";

      if (urgency === "immediate") {
        turnaround = "Urgent Counsel Within 2 Hours";
        feeScope = "Emergency Injunction Retainer (Custom Consultation)";
        seniorCounsel = "Senior Partner & King's Counsel (KC) Barrister";
      } else if (urgency === "priority") {
        turnaround = "Within 6-12 Hours";
        feeScope = "Expedited Preliminary Assessment: £550 + VAT";
        seniorCounsel = "Partner-Led Strategic Review";
      }

      if (resultBox) {
        resultBox.innerHTML = `
          <div class="calc-output-card p-4 rounded-3 border-gold-glow animate-fade-in">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="badge bg-gold text-navy fw-bold px-3 py-2"><i class="fa-solid fa-check-double me-1"></i> Assessment Ready</span>
              <span class="text-white-50 fs-8">Strict Legal Privilege Applied</span>
            </div>
            <h5 class="text-white mb-2">${serviceType.toUpperCase()} &bull; ${jurisdiction}</h5>
            <p class="text-gold fw-bold fs-6 mb-2"><i class="fa-solid fa-clock me-2"></i>Response Time: ${turnaround}</p>
            <p class="text-white-50 fs-7 mb-2"><i class="fa-solid fa-gavel me-2"></i>Counsel Tier: ${seniorCounsel}</p>
            <p class="text-white-50 fs-7 mb-3"><i class="fa-solid fa-shield-halved me-2"></i>Indicative Fee Structure: ${feeScope}</p>
            <a href="${getUrl("contact")}" class="btn btn-gold btn-sm w-100 py-2">Lock In Consultation Slot</a>
          </div>
        `;
        resultBox.classList.remove("d-none");
      }
    });
  }

  // Hero Stats Matrix Counter Animation
  const heroStatNumbers = document.querySelectorAll(
    ".hero-stat-card .stat-number",
  );
  if (heroStatNumbers.length) {
    const animateHeroStat = (el) => {
      const original = el.textContent.trim();
      const num = parseFloat(original.replace(/[^0-9.]/g, ""));
      if (isNaN(num)) return;
      const prefix = original.match(/^[^0-9]*/)[0];
      const suffix = original.match(/[^0-9.]+$/)?.[0] || "";
      const isDecimal = num % 1 !== 0;
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * num;
        el.textContent =
          prefix +
          (isDecimal
            ? current.toFixed(1)
            : Math.floor(current).toLocaleString()) +
          suffix;
        if (progress < 1) requestAnimationFrame(step);
        else
          el.textContent =
            prefix +
            (isDecimal ? num.toFixed(1) : num.toLocaleString()) +
            suffix;
      };
      requestAnimationFrame(step);
    };

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroStatNumbers.forEach(animateHeroStat);
            heroObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    heroObserver.observe(heroStatNumbers[0].closest(".hero-stats-matrix"));
  }

  // About Page – Section 7: Statistical Performance Metrics counter
  const aboutStatSection = document.querySelector(
    ".py-5.bg-light .row.g-4.text-center",
  );
  if (aboutStatSection) {
    const aboutStatEls = aboutStatSection.querySelectorAll("h2");
    const animateAboutStat = (el) => {
      const original = el.textContent.trim();
      const num = parseFloat(original.replace(/[^0-9.]/g, ""));
      if (isNaN(num)) return;
      const prefix = original.match(/^[^0-9£]*/)[0];
      const currency = original.includes("£") ? "£" : "";
      const suffix = original.match(/[^0-9.]+$/)?.[0] || "";
      const isDecimal = num % 1 !== 0;
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * num;
        el.textContent =
          prefix +
          currency +
          (isDecimal
            ? current.toFixed(1)
            : Math.floor(current).toLocaleString()) +
          suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = original;
      };
      requestAnimationFrame(step);
    };
    const aboutStatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutStatEls.forEach(animateAboutStat);
            aboutStatObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    aboutStatObserver.observe(aboutStatSection);
  }

  // 2. Animated Stat Counters (Section 8)
  const statHeadings = document.querySelectorAll(
    ".statistical-achievements h2",
  );
  if (statHeadings.length) {
    const parseTarget = (text) => {
      const num = parseFloat(text.replace(/[^0-9.]/g, ""));
      const prefix = text.match(/^[^0-9]*/)[0];
      const suffix = text.match(/[^0-9.]+$/)?.[0] || "";
      return { num, prefix, suffix };
    };

    const animateCounter = (el) => {
      const { num, prefix, suffix } = parseTarget(el.textContent.trim());
      const isDecimal = num % 1 !== 0;
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * num;
        el.textContent =
          prefix +
          (isDecimal
            ? current.toFixed(1)
            : Math.floor(current).toLocaleString()) +
          suffix;
        if (progress < 1) requestAnimationFrame(step);
        else
          el.textContent =
            prefix +
            (isDecimal ? num.toFixed(1) : num.toLocaleString()) +
            suffix;
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statHeadings.forEach(animateCounter);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(statHeadings[0].closest("section"));
  }

  // 2. Interactive FAQ Accordion Behavior
  document.querySelectorAll(".legal-faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".legal-faq-item");
      const isOpen = item.classList.contains("active");

      // Close all others in same container
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll(".legal-faq-item").forEach((el) => {
          el.classList.remove("active");
          const ans = el.querySelector(".legal-faq-answer");
          if (ans) ans.style.maxHeight = null;
        });
      }

      if (!isOpen) {
        item.classList.add("active");
        const answer = item.querySelector(".legal-faq-answer");
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }
    });
  });

  // Open first FAQ by default
  const firstFaq = document.querySelector(".legal-faq-item");
  if (firstFaq) {
    firstFaq.classList.add("active");
    const ans = firstFaq.querySelector(".legal-faq-answer");
    if (ans) ans.style.maxHeight = ans.scrollHeight + "px";
  }

  // 3. Interactive Filter Tabs for Case Studies / Services
  document.querySelectorAll(".filter-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      parent
        .querySelectorAll(".filter-tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");
      const targetGrid = document.querySelector(
        btn.getAttribute("data-target") || ".filterable-grid",
      );
      if (!targetGrid) return;

      targetGrid.querySelectorAll(".filter-item").forEach((card) => {
        if (filterVal === "all" || card.classList.contains(filterVal)) {
          card.style.display = "";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // ── Input Restrictors: Letters-only & Digits-only ──────────────────
  function setupAlphabetsOnlyInput(input) {
    if (!input) return;

    input.addEventListener("keydown", (e) => {
      // Allow control/navigation keys
      if (
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "Escape" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        return;
      }
      // Allow shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      // Prevent key if not a letter or space
      if (e.key && e.key.length === 1) {
        if (!/^[a-zA-Z\s]$/.test(e.key)) {
          e.preventDefault();
        }
      }
    });

    input.addEventListener("beforeinput", (e) => {
      if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    input.addEventListener("input", function () {
      const cleaned = this.value.replace(/[^a-zA-Z\s]/g, "");
      if (this.value !== cleaned) {
        this.value = cleaned;
      }
    });

    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const text =
        (e.clipboardData || window.clipboardData).getData("text") || "";
      const cleaned = text.replace(/[^a-zA-Z\s]/g, "");
      const start = this.selectionStart || 0;
      const end = this.selectionEnd || 0;
      const val = this.value;
      this.value = val.slice(0, start) + cleaned + val.slice(end);
      this.setSelectionRange(start + cleaned.length, start + cleaned.length);
    });
  }

  function setupNumbersOnlyInput(input) {
    if (!input) return;

    input.addEventListener("keydown", (e) => {
      // Allow control/navigation keys
      if (
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "Escape" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        return;
      }
      // Allow shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
      if (e.ctrlKey || e.metaKey) {
        return;
      }
      // Prevent key if not a digit
      if (e.key && e.key.length === 1) {
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      }
    });

    input.addEventListener("beforeinput", (e) => {
      if (e.data && !/^[0-9]+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    input.addEventListener("input", function () {
      const cleaned = this.value.replace(/[^0-9]/g, "");
      if (this.value !== cleaned) {
        this.value = cleaned;
      }
    });

    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const text =
        (e.clipboardData || window.clipboardData).getData("text") || "";
      const cleaned = text.replace(/[^0-9]/g, "");
      const start = this.selectionStart || 0;
      const end = this.selectionEnd || 0;
      const val = this.value;
      this.value = val.slice(0, start) + cleaned + val.slice(end);
      this.setSelectionRange(start + cleaned.length, start + cleaned.length);
    });
  }

  // 4. Consultation Booking / Contact Form Handler (Confidential Consultation Request)
  const contactForm = document.getElementById("legalContactForm");
  if (contactForm) {
    const contactNameInput =
      document.getElementById("contactName") ||
      contactForm.querySelector("input[name='fullName']") ||
      contactForm.querySelector("input[type='text']");
    if (contactNameInput) {
      setupAlphabetsOnlyInput(contactNameInput);
    }

    const contactPhoneInput =
      document.getElementById("contactPhone") ||
      contactForm.querySelector("input[name='phone']") ||
      contactForm.querySelector("input[type='tel']");
    if (contactPhoneInput) {
      setupNumbersOnlyInput(contactPhoneInput);
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      window.location.href = getUrl("404");
    });
  }

  // 5. Hero Priority Case Evaluation Interactive Handling
  const heroPillSelector = document.getElementById("heroPillSelector");
  const heroPracticeSelect = document.getElementById("heroPracticeSelect");
  const heroQuickForm = document.getElementById("heroQuickForm");

  if (heroPillSelector && heroPracticeSelect) {
    const pillButtons = heroPillSelector.querySelectorAll(".pill-select-btn");

    pillButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        pillButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const practice = btn.getAttribute("data-practice");
        if (
          practice &&
          heroPracticeSelect.querySelector(`option[value="${practice}"]`)
        ) {
          heroPracticeSelect.value = practice;
        }
      });
    });

    heroPracticeSelect.addEventListener("change", () => {
      const selectedVal = heroPracticeSelect.value;
      pillButtons.forEach((btn) => {
        if (btn.getAttribute("data-practice") === selectedVal) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });
  }

  if (heroQuickForm) {
    const heroNameInput =
      document.getElementById("heroName") ||
      heroQuickForm.querySelector("input[name='fullName']") ||
      heroQuickForm.querySelector("input[type='text']");
    if (heroNameInput) {
      setupAlphabetsOnlyInput(heroNameInput);
    }

    const heroPhoneInput =
      document.getElementById("heroPhone") ||
      heroQuickForm.querySelector("input[name='phone']") ||
      heroQuickForm.querySelector("input[type='tel']");
    if (heroPhoneInput) {
      setupNumbersOnlyInput(heroPhoneInput);
    }

    heroQuickForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!heroQuickForm.checkValidity()) {
        heroQuickForm.reportValidity();
        return;
      }
      window.location.href = getUrl("404");
    });
  }

  // 5b. Blog Page Subscribe Form Handler
  const blogSubscribeForm =
    document.getElementById("blogSubscribeForm") ||
    document.querySelector(".newsletter-digest-card form");
  if (blogSubscribeForm) {
    blogSubscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!blogSubscribeForm.checkValidity()) {
        blogSubscribeForm.reportValidity();
        return;
      }
      window.location.href = getUrl("404");
    });
  }

  // ── Global Handler: Redirect empty links and '#' to 404 Page ─────────
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    // Skip if link has a data-page that has or will be handled
    const dataPage = link.getAttribute("data-page");
    if (dataPage) return;

    const href = link.getAttribute("href");

    // Check for empty, whitespace, hash-only, or javascript void links
    const isPlaceholder =
      href === null ||
      href === "" ||
      href.trim() === "" ||
      href === "#" ||
      href === "#!" ||
      href.toLowerCase() === "javascript:void(0)" ||
      href.toLowerCase() === "javascript:void(0);" ||
      href.toLowerCase() === "javascript:;";

    // Check for hash anchors that do not match any element on the current page
    let isBrokenHash = false;
    if (href && href.startsWith("#") && href.length > 1) {
      const targetId = href.substring(1);
      if (!document.getElementById(targetId)) {
        isBrokenHash = true;
      }
    }

    if (isPlaceholder || isBrokenHash) {
      e.preventDefault();
      const inPages = window.location.pathname
        .toLowerCase()
        .includes("/pages/");
      const target404 = inPages ? "../404.html" : "404.html";
      window.location.href = target404;
    }
  });

  // ── 6. Executive Scroll Reveal Observer Engine ────────────────────────
  function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Thematic selectors spanning home page and all subpages
    const autoSelectors = [
      ".home-hero-content",
      ".hero-card-container",
      ".page-banner-content",
      "section > .container > .row:first-child",
      "section .section-header",
      "section .section-title",
      "section .section-desc",
      "section .text-center.mb-5",
      "section .text-center.mb-4",
      ".accreditations-bar",
      ".accred-logo-card",
      ".hero-stat-card",
      ".hero-stat-matrix",
      ".legal-card",
      ".legal-card-dark",
      ".pillar-card",
      ".attorney-card",
      ".case-study-card",
      ".featured-article-card",
      ".legal-article-card",
      ".pricing-fee-card",
      ".process-step-card",
      ".contact-channel-card",
      ".award-seal-card",
      ".testimonial-card",
      ".whitepaper-card",
      ".timeline-milestone",
      ".timeline-item",
      ".london-office-map-card",
      ".consultation-form-card",
      ".newsletter-digest-card",
      ".calc-container",
      ".legal-assessment-calculator",
      ".calc-output-card",
      ".cta-banner",
      ".cta-banner-content",
      ".error-hero-card",
      ".error-matrix-card",
      ".error-emergency-banner",
    ];

    const explicitTargets = Array.from(
      document.querySelectorAll(
        ".reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-zoom, .reveal-fade, .section-reveal-header",
      ),
    );

    const autoTargets = Array.from(
      document.querySelectorAll(autoSelectors.join(", ")),
    );

    const allTargets = Array.from(
      new Set([...explicitTargets, ...autoTargets]),
    );

    if (!allTargets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      allTargets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    // Auto-stagger column siblings in multi-card rows
    document.querySelectorAll(".row").forEach((row) => {
      const cards = row.querySelectorAll(
        ":scope > [class*='col'] > .legal-card, " +
          ":scope > [class*='col'] > .attorney-card, " +
          ":scope > [class*='col'] > .case-study-card, " +
          ":scope > [class*='col'] > .legal-article-card, " +
          ":scope > [class*='col'] > .pricing-fee-card, " +
          ":scope > [class*='col'] > .process-step-card, " +
          ":scope > [class*='col'] > .contact-channel-card, " +
          ":scope > [class*='col'] > .award-seal-card, " +
          ":scope > [class*='col'] > .hero-stat-card, " +
          ":scope > [class*='col'] > .accred-logo-card, " +
          ":scope > [class*='col'] > .error-matrix-card",
      );
      if (cards.length > 1) {
        cards.forEach((card, idx) => {
          if (!card.className.includes("reveal-delay-")) {
            const delay = Math.min((idx % 4) * 0.12, 0.48);
            if (delay > 0) {
              card.style.transitionDelay = `${delay}s`;
            }
          }
        });
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.1,
      },
    );

    allTargets.forEach((el) => {
      if (
        !el.classList.contains("reveal") &&
        !el.classList.contains("reveal-up") &&
        !el.classList.contains("reveal-down") &&
        !el.classList.contains("reveal-left") &&
        !el.classList.contains("reveal-right") &&
        !el.classList.contains("reveal-zoom") &&
        !el.classList.contains("reveal-fade") &&
        !el.classList.contains("section-reveal-header")
      ) {
        el.classList.add("reveal-up");
      }

      const rect = el.getBoundingClientRect();
      const inViewOnLoad =
        rect.top < window.innerHeight - 30 && rect.bottom > 0;
      if (inViewOnLoad) {
        setTimeout(() => {
          el.classList.add("is-revealed");
        }, 100);
      } else {
        observer.observe(el);
      }
    });
  }

  // Initialize Scroll Reveal
  initScrollReveal();
});
