(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => r.querySelectorAll(s);

  let heroIndex = 0;
  let lightboxImages = [];
  let lightboxIndex = 0;

  function initHeader() {
    const header = $("#header");
    const toggle = $("#navToggle");
    const nav = $("#navMenu");
    const progress = $("#scrollProgress");

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("topbar--solid", y > 40);
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = h > 0 ? (y / h) * 100 + "%" : "0%";
      }
    }, { passive: true });

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });

    $$(".topbar__nav a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initHeroRotate() {
    const el = $("#heroRotate");
    if (!el || !HERO_WORDS.length) return;

    setInterval(() => {
      heroIndex = (heroIndex + 1) % HERO_WORDS.length;
      el.classList.add("is-out");
      setTimeout(() => {
        el.textContent = "ب" + HERO_WORDS[heroIndex];
        el.classList.remove("is-out");
      }, 300);
    }, 3000);
  }

  function renderSolutions() {
    const grid = $("#solutionsGrid");
    if (!grid) return;

    grid.innerHTML = SOLUTIONS.map((s, i) => {
      const wide = i < 2 ? " bento-card--wide" : "";
      const num = String(i + 1).padStart(2, "0");
      return `
        <article class="bento-card${wide} reveal">
          <div class="bento-card__bg">
            <img src="${s.image}" alt="" loading="lazy">
          </div>
          <div class="bento-card__body">
            <span class="bento-card__idx">${num}</span>
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
            <a href="${waLink(s.waText)}" class="btn btn--glass" target="_blank" rel="noopener">حجز الخدمة ←</a>
          </div>
        </article>
      `;
    }).join("");

    const select = $("#service");
    if (select) {
      SOLUTIONS.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.title;
        opt.textContent = s.title;
        select.appendChild(opt);
      });
    }
  }

  function renderShowreel() {
    const grid = $("#showreelGrid");
    if (!grid || !SHOWREEL_VIDEOS) return;

    grid.innerHTML = SHOWREEL_VIDEOS.map((v) => `
      <figure class="reel-item reveal">
        <video controls playsinline preload="metadata" poster="assets/images/hero-banner.jpeg">
          <source src="${v.src}" type="video/mp4">
        </video>
        <figcaption>${v.title}</figcaption>
      </figure>
    `).join("");
  }

  function renderPortfolioTab(index) {
    const cat = PORTFOLIO[index];
    const panel = $("#portfolioPanel");
    if (!panel || !cat) return;

    const imgs = cat.images || [];
    const vids = cat.videos || [];
    lightboxImages = imgs;

    let html = "";

    if (vids.length) {
      html += `<div class="works__videos">${vids.map((v) => `
        <figure class="reel-item">
          <video controls playsinline preload="metadata">
            <source src="${v.src}" type="video/mp4">
          </video>
          <figcaption>${v.title}</figcaption>
        </figure>
      `).join("")}</div>`;
    }

    if (imgs.length) {
      html += `
        <div class="works__featured" data-lb="0" role="button" tabindex="0">
          <img src="${cat.cover}" alt="${cat.label}" loading="lazy">
          <span class="works__featured-label">${cat.label} — اضغط للتكبير</span>
        </div>
        <div class="works__mosaic">
          ${imgs.map((src, i) => `
            <button type="button" class="mosaic-item" data-lb="${i}" aria-label="صورة ${i + 1}">
              <img src="${src}" alt="" loading="lazy">
            </button>
          `).join("")}
        </div>
      `;
    } else if (cat.cover) {
      html += `<div class="works__featured"><img src="${cat.cover}" alt="${cat.label}"></div>`;
    }

    panel.innerHTML = html;

    $$("[data-lb]", panel).forEach((el) => {
      const open = () => openLightbox(Number(el.dataset.lb));
      el.addEventListener("click", open);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
    });
  }

  function initPortfolio() {
    const tabs = $("#portfolioTabs");
    if (!tabs) return;

    tabs.innerHTML = PORTFOLIO.map((p, i) => `
      <button type="button" role="tab" class="filter-pill${i === 0 ? " is-active" : ""}" data-tab="${i}" aria-selected="${i === 0}">${p.label}</button>
    `).join("");

    renderPortfolioTab(0);

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (!btn) return;
      $$(".filter-pill", tabs).forEach((t) => {
        t.classList.toggle("is-active", t === btn);
        t.setAttribute("aria-selected", t === btn);
      });
      renderPortfolioTab(Number(btn.dataset.tab));
      observeReveal();
    });
  }

  function openLightbox(index) {
    const dlg = $("#lightbox");
    const img = $("#lightboxImg");
    if (!dlg || !img || !lightboxImages.length) return;
    lightboxIndex = index;
    img.src = lightboxImages[lightboxIndex];
    img.alt = "Genix ID";
    dlg.showModal();
  }

  function initLightbox() {
    const dlg = $("#lightbox");
    const img = $("#lightboxImg");
    if (!dlg) return;

    $("#lightboxClose").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    $("#lightboxPrev").addEventListener("click", () => {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      img.src = lightboxImages[lightboxIndex];
    });
    $("#lightboxNext").addEventListener("click", () => {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      img.src = lightboxImages[lightboxIndex];
    });
    document.addEventListener("keydown", (e) => {
      if (!dlg.open) return;
      if (e.key === "ArrowLeft") $("#lightboxNext").click();
      if (e.key === "ArrowRight") $("#lightboxPrev").click();
      if (e.key === "Escape") dlg.close();
    });
  }

  function validateField(input) {
    const wrap = input.closest(".fld");
    const err = document.querySelector(`.fld__err[data-for="${input.id}"]`);
    let msg = "";

    if (input.required && !input.value.trim()) msg = "مطلوب";
    else if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = "بريد غير صالح";
    else if (input.id === "phone" && input.value && !input.checkValidity()) msg = "رقم غير صالح";
    else if (input.minLength > 0 && input.value.trim().length < input.minLength) msg = `الحد الأدنى ${input.minLength} حرف`;

    wrap?.classList.toggle("is-invalid", !!msg);
    if (err) err.textContent = msg;
    return !msg;
  }

  function initForm() {
    const form = $("#projectForm");
    const modal = $("#successModal");
    if (!form) return;

    $$("#projectForm input, #projectForm textarea, #projectForm select").forEach((inp) => {
      inp.addEventListener("blur", () => validateField(inp));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = $$("#projectForm input, #projectForm textarea, #projectForm select");
      if (![...fields].every((f) => validateField(f))) return;

      try {
        const list = JSON.parse(localStorage.getItem("genix_requests") || "[]");
        list.push({ at: new Date().toISOString(), data: Object.fromEntries(new FormData(form)) });
        localStorage.setItem("genix_requests", JSON.stringify(list));
      } catch { /* */ }

      form.reset();
      fields.forEach((f) => {
        f.closest(".fld")?.classList.remove("is-invalid");
        const err = document.querySelector(`.fld__err[data-for="${f.id}"]`);
        if (err) err.textContent = "";
      });
      modal.showModal();
    });

    $("#successClose").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  }

  let revealObs;
  function observeReveal() {
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            revealObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    }
    $$(".reveal:not(.is-visible)").forEach((el) => revealObs.observe(el));
  }

  function init() {
    initHeader();
    initHeroRotate();
    renderSolutions();
    renderShowreel();
    initPortfolio();
    initLightbox();
    initForm();
    observeReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();