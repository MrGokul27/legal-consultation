document.addEventListener("DOMContentLoaded", () => {
  // ── Role Definitions & Configurations ──────────────────────────────────
  const ROLE_CONFIGS = {
    "corporate-counsel": {
      id: "corporate-counsel",
      title: "Corporate General Counsel / Client",
      shortTitle: "General Counsel",
      defaultName: "Counsel Eleanor Vance",
      defaultEmail: "counsel@enterprise.co.uk",
      badgeClass: "badge-counsel",
      themeAccent: "Corporate & M&A Retainer",
      views: [
        {
          id: "counsel-overview",
          label: "Overview & Retainers",
          icon: "fa-chart-line",
          badge: "6 Active",
        },
        {
          id: "counsel-matters",
          label: "Active Litigations",
          icon: "fa-scale-balanced",
          badge: "High Court",
        },
        {
          id: "counsel-billing",
          label: "Escrow & Outside Spend",
          icon: "fa-file-invoice-dollar",
          badge: "SRA Escrow",
        },
        {
          id: "counsel-vault",
          label: "Evidentiary Filings Vault",
          icon: "fa-vault",
          badge: "LPP Encrypted",
        },
        {
          id: "counsel-messages",
          label: "Privileged Chambers Briefs",
          icon: "fa-comments",
          badge: "3 Unread",
        },
      ],
    },
    "managing-partner": {
      id: "managing-partner",
      title: "Senior Managing Partner / KC Barrister",
      shortTitle: "Managing Partner",
      defaultName: "Lord Alistair Vance KC",
      defaultEmail: "alistair.vance@stacklylegal.co.uk",
      badgeClass: "badge-partner",
      themeAccent: "King's Counsel Chambers",
      views: [
        {
          id: "partner-overview",
          label: "Chambers Executive & Revenue",
          icon: "fa-landmark",
          badge: "£14.8M YTD",
        },
        {
          id: "partner-docket",
          label: "King's Counsel Hearing Docket",
          icon: "fa-gavel",
          badge: "Court of Appeal",
        },
        {
          id: "partner-practice",
          label: "Practice Groups & Utilization",
          icon: "fa-chart-pie",
          badge: "96.8%",
        },
        {
          id: "partner-trust",
          label: "Trust Accounts & Dividends",
          icon: "fa-sack-dollar",
          badge: "SRA 2019",
        },
        {
          id: "partner-pupillage",
          label: "Chambers Pupils & Talent",
          icon: "fa-user-graduate",
          badge: "42 Silks",
        },
      ],
    },
    "associate-solicitor": {
      id: "associate-solicitor",
      title: "Associate Solicitor / Legal Consultant",
      shortTitle: "Associate Solicitor",
      defaultName: "Julian Sterling, Solicitor",
      defaultEmail: "j.sterling@stacklylegal.co.uk",
      badgeClass: "badge-solicitor",
      themeAccent: "Chancery & Commercial Practice",
      views: [
        {
          id: "solicitor-overview",
          label: "Casework & Billables Summary",
          icon: "fa-briefcase",
          badge: "38.5 hrs",
        },
        {
          id: "solicitor-drafting",
          label: "Drafting Queue & Filings",
          icon: "fa-feather-pointed",
          badge: "3 Due",
        },
        {
          id: "solicitor-time",
          label: "Billable Time Tracker",
          icon: "fa-stopwatch",
          badge: "£450/hr",
        },
        {
          id: "solicitor-precedents",
          label: "Precedent & Case Law",
          icon: "fa-book-bookmark",
          badge: "Westlaw",
        },
        {
          id: "solicitor-advisory",
          label: "Client Advisory Sessions",
          icon: "fa-calendar-check",
          badge: "4 Today",
        },
      ],
    },
    "compliance-officer": {
      id: "compliance-officer",
      title: "Compliance & Data Protection Officer",
      shortTitle: "Compliance Officer",
      defaultName: "Dame Beatrice Croft, CDPO",
      defaultEmail: "compliance@stacklylegal.co.uk",
      badgeClass: "badge-compliance",
      themeAccent: "Regulatory & Ethics Governance",
      views: [
        {
          id: "compliance-overview",
          label: "Regulatory & AML Overview",
          icon: "fa-shield-halved",
          badge: "99.4%",
        },
        {
          id: "compliance-conflicts",
          label: "Conflict of Interest Checks",
          icon: "fa-handshake-slash",
          badge: "2 Urgent",
        },
        {
          id: "compliance-aml",
          label: "AML & CDD Screening",
          icon: "fa-fingerprint",
          badge: "142 Cleared",
        },
        {
          id: "compliance-gdpr",
          label: "GDPR & Privilege Vault",
          icon: "fa-lock",
          badge: "ISO 27001",
        },
        {
          id: "compliance-sra",
          label: "SRA Standards & Audits",
          icon: "fa-certificate",
          badge: "Audited",
        },
      ],
    },
  };

  // ── Session State Management ───────────────────────────────────────────
  function getActiveUserSession() {
    let session = null;
    try {
      const stored = localStorage.getItem("stackly_legal_user");
      if (stored) {
        session = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not parse legal session from localStorage", e);
    }

    // If no session exists, default gracefully to corporate counsel demo
    if (!session || !session.role || !ROLE_CONFIGS[session.role]) {
      session = {
        role: "corporate-counsel",
        roleLabel: ROLE_CONFIGS["corporate-counsel"].title,
        email: ROLE_CONFIGS["corporate-counsel"].defaultEmail,
        displayName: ROLE_CONFIGS["corporate-counsel"].defaultName,
        loginTime: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        rememberMe: true,
        isDefaultDemo: true,
      };
      localStorage.setItem("stackly_legal_user", JSON.stringify(session));
    }

    return session;
  }

  let currentSession = getActiveUserSession();
  let currentRoleId = currentSession.role;
  let currentViewId = "";

  // ── DOM Element Cache ──────────────────────────────────────────────────
  const sidebarNavList = document.getElementById("sidebarNavList");
  const sidebarNavTitle = document.getElementById("sidebarNavTitle");
  const sidebarUserName = document.getElementById("sidebarUserName");
  const sidebarUserEmail = document.getElementById("sidebarUserEmail");
  const sidebarUserRole = document.getElementById("sidebarUserRole");
  const sidebarAvatar = document.getElementById("sidebarAvatar");

  const topbarUserEmail = document.getElementById("topbarUserEmail");
  const topbarAvatar = document.getElementById("topbarAvatar");
  const topbarRoleBadge = document.getElementById("topbarRoleBadge");
  const topbarActiveBreadcrumb = document.getElementById(
    "topbarActiveBreadcrumb",
  );

  const bannerDisplayName = document.getElementById("bannerDisplayName");
  const bannerUserEmail = document.getElementById("bannerUserEmail");
  const bannerRoleName = document.getElementById("bannerRoleName");
  const bannerLoginTime = document.getElementById("bannerLoginTime");
  const bannerSecurityPill = document.getElementById("bannerSecurityPill");

  const dashboardSidebar = document.getElementById("dashboardSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

  // ── Render User Profile Data Across Page ───────────────────────────────
  function renderUserProfile() {
    const roleConfig =
      ROLE_CONFIGS[currentRoleId] || ROLE_CONFIGS["corporate-counsel"];

    const displayName = currentSession.displayName || roleConfig.defaultName;
    const email = currentSession.email || roleConfig.defaultEmail;
    const initials =
      displayName
        .split(" ")
        .map((n) => n.charAt(0))
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "SL";

    // Sidebar User Card
    if (sidebarUserName) sidebarUserName.textContent = displayName;
    if (sidebarUserEmail) sidebarUserEmail.textContent = email;
    if (sidebarUserRole) sidebarUserRole.textContent = roleConfig.shortTitle;
    if (sidebarAvatar) sidebarAvatar.textContent = initials;

    // Topbar Profile
    if (topbarUserEmail) topbarUserEmail.textContent = email;
    if (topbarAvatar) topbarAvatar.textContent = initials;
    if (topbarRoleBadge) topbarRoleBadge.textContent = roleConfig.shortTitle;

    // Welcome Banner
    if (bannerDisplayName) bannerDisplayName.textContent = displayName;
    if (bannerUserEmail) bannerUserEmail.textContent = email;
    if (bannerRoleName) bannerRoleName.textContent = roleConfig.title;
    if (bannerLoginTime)
      bannerLoginTime.textContent =
        currentSession.loginTime || "Active Session";
    if (bannerSecurityPill) {
      bannerSecurityPill.innerHTML = `<i class="fa-solid fa-lock text-gold me-1"></i>SRA Authorized Session (Encrypted LPP Token: #${Math.floor(100000 + Math.random() * 900000)})`;
    }

    // Update active state in role switcher dropdown
    document
      .querySelectorAll(".role-switcher-dropdown .dropdown-item")
      .forEach((item) => {
        const targetRole = item.getAttribute("data-role-switch");
        if (targetRole === currentRoleId) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
  }

  // ── Render Dynamic Sidebar Navigation based on Role ────────────────────
  function renderSidebarNav() {
    const roleConfig =
      ROLE_CONFIGS[currentRoleId] || ROLE_CONFIGS["corporate-counsel"];
    if (!sidebarNavList) return;

    if (sidebarNavTitle) {
      sidebarNavTitle.textContent = `${roleConfig.shortTitle} Menus`;
    }

    sidebarNavList.innerHTML = "";

    roleConfig.views.forEach((view, index) => {
      const li = document.createElement("li");
      li.className = "sidebar-nav-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `sidebar-nav-link ${index === 0 ? "active" : ""}`;
      btn.setAttribute("data-view-target", view.id);
      btn.innerHTML = `
        <i class="fa-solid ${view.icon} nav-icon"></i>
        <span>${view.label}</span>
        ${view.badge ? `<span class="nav-badge">${view.badge}</span>` : ""}
      `;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        activateView(view.id, view.label);
        // On mobile, close sidebar after clicking
        if (window.innerWidth < 992) {
          closeMobileSidebar();
        }
      });

      li.appendChild(btn);
      sidebarNavList.appendChild(li);
    });

    // Default to first view of current role
    if (roleConfig.views.length > 0) {
      activateView(roleConfig.views[0].id, roleConfig.views[0].label);
    }
  }

  // ── Switch Active View Pane ────────────────────────────────────────────
  function activateView(viewId, viewLabel) {
    currentViewId = viewId;

    // Update sidebar nav active class
    document.querySelectorAll(".sidebar-nav-link").forEach((link) => {
      if (link.getAttribute("data-view-target") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Hide all view panes, show the target one
    document.querySelectorAll(".dashboard-view-pane").forEach((pane) => {
      if (pane.id === `view-${viewId}`) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });

    // Update topbar breadcrumb
    if (topbarActiveBreadcrumb && viewLabel) {
      topbarActiveBreadcrumb.textContent = viewLabel;
    }

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Switch Role Functionality ──────────────────────────────────────────
  function switchRole(newRoleId) {
    if (!ROLE_CONFIGS[newRoleId]) return;

    currentRoleId = newRoleId;
    const config = ROLE_CONFIGS[newRoleId];

    // Update active session in memory and localStorage
    currentSession.role = newRoleId;
    currentSession.roleLabel = config.title;
    // Update display name and email if default or user prefers
    currentSession.displayName = config.defaultName;
    currentSession.email = config.defaultEmail;

    localStorage.setItem("stackly_legal_user", JSON.stringify(currentSession));

    renderUserProfile();
    renderSidebarNav();
  }

  // Bind role switcher dropdown items
  document.querySelectorAll("[data-role-switch]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetRole = btn.getAttribute("data-role-switch");
      if (targetRole && ROLE_CONFIGS[targetRole]) {
        switchRole(targetRole);
      }
    });
  });

  // ── Logout Handling ────────────────────────────────────────────────────
  function handleLogout() {
    // Clear user session from storage
    localStorage.removeItem("stackly_legal_user");
    // Also clear session flag if any
    sessionStorage.removeItem("stackly_auth_active");
    // Redirect cleanly to login.html
    window.location.href = "login.html";
  }

  document
    .querySelectorAll(".btn-logout, [data-action='logout']")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
      });
    });

  // ── Mobile Sidebar Controls ────────────────────────────────────────────
  function openMobileSidebar() {
    if (dashboardSidebar) dashboardSidebar.classList.add("show");
    if (sidebarOverlay) sidebarOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeMobileSidebar() {
    if (dashboardSidebar) dashboardSidebar.classList.remove("show");
    if (sidebarOverlay) sidebarOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener("click", openMobileSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
  }

  // Close mobile sidebar on Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      dashboardSidebar &&
      dashboardSidebar.classList.contains("show")
    ) {
      closeMobileSidebar();
    }
  });

  // Automatically reset mobile sidebar if viewport expands to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeMobileSidebar();
    }
  });

  // ── REQUIREMENT 7: 404 REDIRECTION ENGINE ──────────────────────────────
  // "Dashboard all the empty links, # and buttons click and redirect to 404 page,
  // just add a script for that. the sidebar menu or logout button should not redirect to 404 page."
  document.addEventListener("click", (e) => {
    // 1. Check if the click is on or within an anchor or button
    const link = e.target.closest("a");
    const button = e.target.closest("button");

    // Exempt sidebar menu items
    if (
      link &&
      (link.classList.contains("sidebar-nav-link") ||
        link.closest(".dashboard-sidebar-nav"))
    )
      return;
    if (
      button &&
      (button.classList.contains("sidebar-nav-link") ||
        button.hasAttribute("data-view-target"))
    )
      return;

    // Exempt logout buttons
    if (
      link &&
      (link.classList.contains("btn-logout") ||
        link.classList.contains("btn-sidebar-logout") ||
        link.getAttribute("data-action") === "logout")
    )
      return;
    if (
      button &&
      (button.classList.contains("btn-logout") ||
        button.classList.contains("btn-sidebar-logout") ||
        button.getAttribute("data-action") === "logout")
    )
      return;

    // Exempt mobile sidebar toggle and close buttons
    if (
      button &&
      (button.id === "mobileSidebarToggle" || button.id === "sidebarCloseBtn")
    )
      return;
    if (button && button.classList.contains("sidebar-close-btn")) return;

    // Exempt Bootstrap dropdown toggles (e.g., Role Switcher, User Dropdown)
    if (button && button.getAttribute("data-bs-toggle") === "dropdown") return;
    if (link && link.getAttribute("data-bs-toggle") === "dropdown") return;

    // Exempt role switcher buttons
    if (button && button.hasAttribute("data-role-switch")) return;
    if (link && link.hasAttribute("data-role-switch")) return;

    // If an anchor link is clicked
    if (link) {
      const href = link.getAttribute("href");
      const isExternalOrValid =
        href &&
        (href.includes("index.html") ||
          href.includes("login.html") ||
          href.includes("about.html") ||
          href.includes("contact.html") ||
          href.includes("services.html") ||
          href.includes("portfolio.html") ||
          href.includes("blog.html") ||
          href.includes("404.html"));

      // If it's a real valid destination file link, allow normal navigation
      if (isExternalOrValid) return;

      // If it's an empty link, '#', '#!', 'javascript:void(0)', or missing href -> Redirect to 404!
      const isPlaceholder =
        !href ||
        href.trim() === "" ||
        href === "#" ||
        href === "#!" ||
        href.toLowerCase().startsWith("javascript:");
      let isBrokenHash = false;
      if (href && href.startsWith("#") && href.length > 1) {
        if (!document.getElementById(href.substring(1))) {
          isBrokenHash = true;
        }
      }

      if (isPlaceholder || isBrokenHash) {
        e.preventDefault();
        window.location.href = "../404.html";
        return;
      }
    }

    // If a button is clicked
    if (button) {
      // Check if button has functional attributes
      const isExemptButton =
        button.hasAttribute("data-bs-toggle") ||
        button.hasAttribute("data-bs-target") ||
        button.hasAttribute("data-role-switch") ||
        button.hasAttribute("data-view-target") ||
        button.hasAttribute("data-action");

      // Non-sidebar, non-auth action buttons (e.g. Export, Print, Filter, Upload, Settle Escrow, File Pleading buttons in tables and cards)
      // Redirect to 404 to satisfy requirement 7!
      if (!isExemptButton) {
        // Only redirect if button is a standalone placeholder action
        e.preventDefault();
        window.location.href = "../404.html";
        return;
      }
    }
  });

  // ── Initialize Dashboard ───────────────────────────────────────────────
  renderUserProfile();
  renderSidebarNav();
});
