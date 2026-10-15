document.addEventListener("DOMContentLoaded", () => {
  // ── Password Visibility Toggle ──────────────────────────────────────────
  document.querySelectorAll(".auth-toggle-pw").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".auth-input-wrap").querySelector("input");
      const icon = btn.querySelector("i");
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });

  // ── Shared Helper Functions ─────────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function evaluatePasswordStrength(pw) {
    const rules = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^a-zA-Z0-9]/.test(pw),
    };

    const passedCount = Object.values(rules).filter(Boolean).length;
    let strength = "weak";
    if (passedCount === 4) strength = "strong";
    else if (passedCount === 3) strength = "good";
    else if (passedCount === 2) strength = "fair";
    else strength = "weak";

    return {
      rules,
      passedCount,
      strength,
      isAcceptable: passedCount >= 3 && rules.length,
    };
  }

  function updateStrengthUI(pw, fillEl, labelEl, rulesWrapEl) {
    if (!fillEl || !labelEl) return;
    if (!pw || pw.length === 0) {
      fillEl.className = "pw-strength-fill";
      labelEl.className = "pw-strength-label";
      labelEl.textContent = "";
      if (rulesWrapEl) {
        rulesWrapEl
          .querySelectorAll(".pw-rule-item")
          .forEach((el) => el.classList.remove("passed"));
      }
      return;
    }

    const { rules, strength } = evaluatePasswordStrength(pw);

    fillEl.className = `pw-strength-fill ${strength}`;
    labelEl.className = `pw-strength-label ${strength}`;
    labelEl.textContent = strength.toUpperCase();

    if (rulesWrapEl) {
      const lenRule = rulesWrapEl.querySelector('[data-rule="len"]');
      const upperRule = rulesWrapEl.querySelector('[data-rule="upper"]');
      const numRule = rulesWrapEl.querySelector('[data-rule="num"]');
      const specialRule = rulesWrapEl.querySelector('[data-rule="special"]');

      if (lenRule) lenRule.classList.toggle("passed", rules.length);
      if (upperRule) upperRule.classList.toggle("passed", rules.uppercase);
      if (numRule) numRule.classList.toggle("passed", rules.number);
      if (specialRule) specialRule.classList.toggle("passed", rules.special);
    }
  }

  function setFieldError(inputEl, errEl, msg) {
    if (inputEl) {
      inputEl.classList.add("is-invalid");
      inputEl.classList.remove("is-valid");
    }
    if (errEl) {
      if (msg) errEl.textContent = msg;
      errEl.classList.add("visible");
    }
  }

  function clearFieldError(inputEl, errEl) {
    if (inputEl) {
      inputEl.classList.remove("is-invalid");
      inputEl.classList.add("is-valid");
    }
    if (errEl) {
      errEl.classList.remove("visible");
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. LOGIN PAGE LOGIC
  // ══════════════════════════════════════════════════════════════════════════
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const roleInput = document.getElementById("loginRole");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const rememberMeInput = document.getElementById("loginRememberMe");

    const roleErr = document.getElementById("loginRoleErr");
    const emailErr = document.getElementById("loginEmailErr");
    const passwordErr = document.getElementById("loginPasswordErr");
    const rememberMeErr = document.getElementById("loginRememberMeErr");

    const pwFill = document.getElementById("loginPwFill");
    const pwLabel = document.getElementById("loginPwLabel");
    const pwRules = document.getElementById("loginPwRules");
    const toastAlert = document.getElementById("loginToastAlert");

    // Pre-fill from registration if available
    try {
      const regUser = JSON.parse(
        localStorage.getItem("stackly_reg_user") || "null",
      );
      if (regUser) {
        if (regUser.email && !emailInput.value)
          emailInput.value = regUser.email;
        if (regUser.role && !roleInput.value) roleInput.value = regUser.role;
      }
    } catch (e) {}

    // Live password strength
    passwordInput.addEventListener("input", () => {
      const pw = passwordInput.value;
      updateStrengthUI(pw, pwFill, pwLabel, pwRules);
      const evalResult = evaluatePasswordStrength(pw);

      if (pw.length > 0 && !evalResult.isAcceptable) {
        setFieldError(
          passwordInput,
          passwordErr,
          "Weak password: Must be at least 8 characters and include uppercase, number, and special symbol.",
        );
      } else if (pw.length > 0) {
        clearFieldError(passwordInput, passwordErr);
      }
    });

    // Real-time input clearing
    roleInput.addEventListener("change", () => {
      if (roleInput.value) clearFieldError(roleInput, roleErr);
    });

    emailInput.addEventListener("input", () => {
      if (isValidEmail(emailInput.value)) clearFieldError(emailInput, emailErr);
    });

    rememberMeInput.addEventListener("change", () => {
      if (rememberMeInput.checked) {
        rememberMeErr.classList.remove("visible");
      }
    });

    // Login Submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Role validation (Required)
      if (!roleInput.value) {
        setFieldError(
          roleInput,
          roleErr,
          "Please select your legal authorization role.",
        );
        isValid = false;
      } else {
        clearFieldError(roleInput, roleErr);
      }

      // 2. Email validation (Required & Format)
      if (!emailInput.value.trim()) {
        setFieldError(
          emailInput,
          emailErr,
          "Corporate email address is required.",
        );
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        setFieldError(
          emailInput,
          emailErr,
          "Please enter a valid corporate email format.",
        );
        isValid = false;
      } else {
        clearFieldError(emailInput, emailErr);
      }

      // 3. Password validation (Required & Weak check)
      const pwVal = passwordInput.value;
      const pwCheck = evaluatePasswordStrength(pwVal);
      if (!pwVal) {
        setFieldError(
          passwordInput,
          passwordErr,
          "Password is required to authenticate.",
        );
        isValid = false;
      } else if (!pwCheck.isAcceptable) {
        setFieldError(
          passwordInput,
          passwordErr,
          "Weak password: Must be at least 8 characters with uppercase, number & symbol.",
        );
        isValid = false;
      } else {
        clearFieldError(passwordInput, passwordErr);
      }

      // 4. Remember Me validation (Required)
      if (!rememberMeInput.checked) {
        rememberMeErr.classList.add("visible");
        isValid = false;
      } else {
        rememberMeErr.classList.remove("visible");
      }

      if (!isValid) return;

      // Successful simulated login
      const submitBtn = loginForm.querySelector(".btn-auth-submit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i>Verifying SRA Credentials...`;
      }

      // Store user session in localStorage so dashboard can display exact entered role and email
      const roleVal = roleInput.value;
      const roleText = roleInput.options[roleInput.selectedIndex]
        ? roleInput.options[roleInput.selectedIndex].text.trim()
        : roleVal;
      const emailVal = emailInput.value.trim();

      // Check if we have registered username for this email
      let displayName = "";
      try {
        const regUser = JSON.parse(
          localStorage.getItem("stackly_reg_user") || "null",
        );
        if (regUser && regUser.email === emailVal && regUser.username) {
          displayName = regUser.username;
        }
      } catch (e) {}

      if (!displayName) {
        const prefix = emailVal.split("@")[0] || "Client";
        displayName = prefix
          .split(/[._-]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      }

      const userSession = {
        role: roleVal,
        roleLabel: roleText,
        email: emailVal,
        displayName: displayName,
        loginTime: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        rememberMe: rememberMeInput.checked,
      };

      localStorage.setItem("stackly_legal_user", JSON.stringify(userSession));

      if (toastAlert) {
        toastAlert.className = "auth-toast-alert success";
        toastAlert.innerHTML = `<i class="fa-solid fa-shield-check me-2"></i>Authentication verified for <strong>${emailVal}</strong>. Redirecting to Chambers Dashboard...`;
      }

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. REGISTER PAGE LOGIC
  // ══════════════════════════════════════════════════════════════════════════
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const usernameInput = document.getElementById("regUsername");
    const roleInput = document.getElementById("regRole");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const confirmInput = document.getElementById("regConfirmPassword");
    const termsInput = document.getElementById("regTerms");

    const usernameErr = document.getElementById("regUsernameErr");
    const roleErr = document.getElementById("regRoleErr");
    const emailErr = document.getElementById("regEmailErr");
    const passwordErr = document.getElementById("regPasswordErr");
    const confirmErr = document.getElementById("regConfirmPasswordErr");
    const termsErr = document.getElementById("regTermsErr");

    const pwFill = document.getElementById("regPwFill");
    const pwLabel = document.getElementById("regPwLabel");
    const pwRules = document.getElementById("regPwRules");
    const toastAlert = document.getElementById("regToastAlert");

    // ── REQUIREMENT 7: USERNAME FIELD RESTRICTIONS ──────────────────────────
    // Prevent numbers, special characters, and spaces from being typed or entered!
    usernameInput.addEventListener("keydown", (e) => {
      // Allow navigation and control keys
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
        "Home",
        "End",
        "Enter",
      ];
      if (allowedKeys.includes(e.key)) return;

      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey || e.metaKey) return;

      // Explicitly block space
      if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
        e.preventDefault();
        return;
      }

      // Block anything that is NOT a pure English letter [a-zA-Z]
      if (e.key.length === 1 && !/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
    });

    // Sanitize on input (catches virtual keyboards, drag-drop, speech-to-text)
    usernameInput.addEventListener("input", () => {
      const sanitized = usernameInput.value.replace(/[^a-zA-Z]/g, "");
      if (usernameInput.value !== sanitized) {
        usernameInput.value = sanitized;
      }
      if (usernameInput.value.length > 0) {
        clearFieldError(usernameInput, usernameErr);
      }
    });

    // Sanitize on paste
    usernameInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteText =
        (e.clipboardData || window.clipboardData).getData("text") || "";
      const cleaned = pasteText.replace(/[^a-zA-Z]/g, "");
      document.execCommand("insertText", false, cleaned);
    });

    // Live password strength evaluation
    passwordInput.addEventListener("input", () => {
      const pw = passwordInput.value;
      updateStrengthUI(pw, pwFill, pwLabel, pwRules);
      const evalResult = evaluatePasswordStrength(pw);

      if (pw.length > 0 && !evalResult.isAcceptable) {
        setFieldError(
          passwordInput,
          passwordErr,
          "Weak password: Must be at least 8 characters with uppercase, number & symbol.",
        );
      } else if (pw.length > 0) {
        clearFieldError(passwordInput, passwordErr);
      }

      // Live confirm password check
      if (confirmInput.value) {
        if (confirmInput.value !== pw) {
          setFieldError(
            confirmInput,
            confirmErr,
            "Confirm password does not match password.",
          );
        } else {
          clearFieldError(confirmInput, confirmErr);
        }
      }
    });

    // Live confirm password match
    confirmInput.addEventListener("input", () => {
      if (!confirmInput.value) {
        setFieldError(
          confirmInput,
          confirmErr,
          "Please confirm your password.",
        );
      } else if (confirmInput.value !== passwordInput.value) {
        setFieldError(
          confirmInput,
          confirmErr,
          "Confirm password does not match password.",
        );
      } else {
        clearFieldError(confirmInput, confirmErr);
      }
    });

    // Role change
    roleInput.addEventListener("change", () => {
      if (roleInput.value) clearFieldError(roleInput, roleErr);
    });

    // Email change
    emailInput.addEventListener("input", () => {
      if (isValidEmail(emailInput.value)) clearFieldError(emailInput, emailErr);
    });

    // Terms change
    termsInput.addEventListener("change", () => {
      if (termsInput.checked) termsErr.classList.remove("visible");
    });

    // Register Form Submit
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Username (Required & letters only, no space or numbers)
      const usernameVal = usernameInput.value.trim();
      if (!usernameVal) {
        setFieldError(
          usernameInput,
          usernameErr,
          "Username is required (letters only, no spaces or numbers).",
        );
        isValid = false;
      } else if (/[^a-zA-Z]/.test(usernameVal)) {
        setFieldError(
          usernameInput,
          usernameErr,
          "Username must contain letters only (no spaces, numbers, or symbols).",
        );
        isValid = false;
      } else {
        clearFieldError(usernameInput, usernameErr);
      }

      // 2. Role (Required)
      if (!roleInput.value) {
        setFieldError(roleInput, roleErr, "Please select your legal role.");
        isValid = false;
      } else {
        clearFieldError(roleInput, roleErr);
      }

      // 3. Email (Required & valid)
      if (!emailInput.value.trim()) {
        setFieldError(emailInput, emailErr, "Email address is required.");
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        setFieldError(
          emailInput,
          emailErr,
          "Please enter a valid corporate email format.",
        );
        isValid = false;
      } else {
        clearFieldError(emailInput, emailErr);
      }

      // 4. Password (Required & Weak check)
      const pwVal = passwordInput.value;
      const pwCheck = evaluatePasswordStrength(pwVal);
      if (!pwVal) {
        setFieldError(passwordInput, passwordErr, "Password is required.");
        isValid = false;
      } else if (!pwCheck.isAcceptable) {
        setFieldError(
          passwordInput,
          passwordErr,
          "Weak password: Must be at least 8 characters with uppercase, number & symbol.",
        );
        isValid = false;
      } else {
        clearFieldError(passwordInput, passwordErr);
      }

      // 5. Confirm Password (Required & Matches Password)
      const confirmVal = confirmInput.value;
      if (!confirmVal) {
        setFieldError(
          confirmInput,
          confirmErr,
          "Please confirm your password.",
        );
        isValid = false;
      } else if (confirmVal !== pwVal) {
        setFieldError(
          confirmInput,
          confirmErr,
          "Confirm password does not match password.",
        );
        isValid = false;
      } else {
        clearFieldError(confirmInput, confirmErr);
      }

      // 6. Terms & Conditions (Required)
      if (!termsInput.checked) {
        termsErr.classList.add("visible");
        isValid = false;
      } else {
        termsErr.classList.remove("visible");
      }

      if (!isValid) return;

      // Save registered profile into localStorage
      try {
        const regData = {
          username: usernameInput.value.trim(),
          role: roleInput.value,
          email: emailInput.value.trim(),
        };
        localStorage.setItem("stackly_reg_user", JSON.stringify(regData));
      } catch (err) {}

      // ── REQUIREMENT 8: REDIRECT TO LOGIN PAGE AFTER REGISTER SUBMIT ─────────
      const submitBtn = registerForm.querySelector(".btn-auth-submit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i>Registering Legal Profile...`;
      }

      if (toastAlert) {
        toastAlert.className = "auth-toast-alert success";
        toastAlert.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i>Account successfully registered! Redirecting to login page...`;
      }

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1400);
    });
  }

  // ── Global Handler: Redirect empty links and '#' to 404 Page ─────────
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const dataPage = link.getAttribute("data-page");
    if (dataPage) return;

    const href = link.getAttribute("href");

    const isPlaceholder =
      href === null ||
      href === "" ||
      href.trim() === "" ||
      href === "#" ||
      href === "#!" ||
      href.toLowerCase() === "javascript:void(0)" ||
      href.toLowerCase() === "javascript:void(0);" ||
      href.toLowerCase() === "javascript:;";

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

  // ── Scroll Reveal for Auth Pages ───────────────────────────────────────
  function initAuthScrollReveal() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = document.querySelectorAll(
      ".auth-panel-content, .auth-card-inner, .auth-feature-item, .auth-stat-col",
    );

    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    targets.forEach((el, idx) => {
      if (
        !el.classList.contains("reveal-up") &&
        !el.classList.contains("reveal-left") &&
        !el.classList.contains("reveal-right")
      ) {
        el.classList.add("reveal-up");
      }
      setTimeout(
        () => {
          el.classList.add("is-revealed");
        },
        100 + idx * 80,
      );
    });
  }

  initAuthScrollReveal();
});
