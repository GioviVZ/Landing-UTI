document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  /* =========================
     AÑO AUTOMÁTICO
  ========================= */
  const yearEl = $("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================
     MENÚ MÓVIL
  ========================= */
  const burger = $("burger");
  const mobile = $("mobile");

  function openMobileMenu() {
    if (!mobile || !burger) return;
    mobile.style.display = "block";
    mobile.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    if (!mobile || !burger) return;
    mobile.style.display = "none";
    mobile.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
  }

  function toggleMobileMenu() {
    if (!mobile) return;
    const isOpen = mobile.style.display === "block";
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  }

  if (burger && mobile) {
    closeMobileMenu();

    burger.addEventListener("click", toggleMobileMenu);

    mobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }

  /* =========================
     TABS GUÍA DE TICKETS
  ========================= */
  const tflow = $("tflowTickets");
  const tabs = document.querySelectorAll(".tflow__tab");

  function activateRoute(route) {
    if (!tflow) return;

    tflow.classList.remove("is-inc", "is-req");
    tflow.classList.add(route === "req" ? "is-req" : "is-inc");

    tabs.forEach((tab) => {
      const active = tab.dataset.route === route;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateRoute(tab.dataset.route || "inc");
      });
    });
  }

  /* =========================
     REVEAL AL HACER SCROLL
  ========================= */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealItems.length) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealItems.forEach((item) => obs.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("show"));
  }

  /* =========================
     MODAL REGISTRO
  ========================= */
  const registroModal = $("registroModal");
  const closeRegistroModalBtn = $("closeRegistroModal");
  const closeRegistroOverlay = $("closeRegistroOverlay");

  const openModalButtons = [
    $("openRegistroTop"),
    $("openRegistroMobile"),
    $("openRegistroHero"),
    $("openRegistroPanel"),
    $("openRegistroFaq"),
  ].filter(Boolean);

  function openRegistroModal() {
    if (!registroModal) return;

    registroModal.classList.add("is-open");
    registroModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    closeMobileMenu();
  }

  function closeRegistroModal() {
    if (!registroModal) return;

    registroModal.classList.remove("is-open");
    registroModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  openModalButtons.forEach((btn) => {
    btn.addEventListener("click", openRegistroModal);
  });

  if (closeRegistroModalBtn) {
    closeRegistroModalBtn.addEventListener("click", closeRegistroModal);
  }

  if (closeRegistroOverlay) {
    closeRegistroOverlay.addEventListener("click", closeRegistroModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && registroModal?.classList.contains("is-open")) {
      closeRegistroModal();
    }
  });

  /* =========================
     CERRAR MODAL SI EL REGISTRO SE ENVÍA OK
     (opcional desde register.js)
  ========================= */
  window.closeRegistroModal = closeRegistroModal;
  window.openRegistroModal = openRegistroModal;
});