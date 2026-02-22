// Menu móvil
const burger = document.getElementById("burger");
const mobile = document.getElementById("mobile");

if (burger && mobile) {
  burger.addEventListener("click", () => {
    const isOpen = mobile.style.display === "block";
    mobile.style.display = isOpen ? "none" : "block";
    burger.setAttribute("aria-expanded", String(!isOpen));
    mobile.setAttribute("aria-hidden", String(isOpen));
  });

  mobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobile.style.display = "none";
      burger.setAttribute("aria-expanded", "false");
      mobile.setAttribute("aria-hidden", "true");
    });
  });
}

// Año footer
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Animación reveal (sutil, pro)
const reveals = document.querySelectorAll(".reveal");
if (reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  reveals.forEach((el) => io.observe(el));
}

// =========================
// TFLOW: Pills + Highlight + Responsive layout
// =========================
(function initTicketFlowTabs(){
  const root = document.getElementById("tflowTickets");
  if (!root) return;

  const tabs = root.querySelectorAll(".tflow__tab");
  const routeInc = root.querySelector("#tflowRouteInc");
  const routeReq = root.querySelector("#tflowRouteReq");

  function setRoute(route){
    const isInc = route === "inc";

    root.classList.toggle("is-inc", isInc);
    root.classList.toggle("is-req", !isInc);

    tabs.forEach(btn => {
      const active = btn.dataset.route === route;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    // Reflow para animación lineal del card (opcional)
    const activeCard = root.querySelector(`.tflow__card[data-route="${route}"]`);
    if (activeCard) {
      activeCard.style.transition = "none";
      activeCard.style.opacity = "0";
      activeCard.style.transform = "translateY(10px)";
      void activeCard.offsetHeight;
      activeCard.style.transition = "";
      activeCard.style.opacity = "";
      activeCard.style.transform = "";
    }
  }

  // ✅ LISTENERS (esto te faltaba)
  tabs.forEach(btn => {
    btn.addEventListener("click", () => setRoute(btn.dataset.route));
  });

  // Click sobre el diagrama también alterna
  if (routeInc) routeInc.addEventListener("click", () => setRoute("inc"));
  if (routeReq) routeReq.addEventListener("click", () => setRoute("req"));

  // Default
  setRoute("inc");
})();

(function initTicketFlowTabs(){
  const root = document.getElementById("tflowTickets");
  if (!root) return;

  const tabs = root.querySelectorAll(".tflow__tab");

  function setRoute(route){
    const isInc = route === "inc";
    root.classList.toggle("is-inc", isInc);
    root.classList.toggle("is-req", !isInc);

    tabs.forEach(btn => {
      const active = btn.dataset.route === route;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  }

  tabs.forEach(btn => btn.addEventListener("click", () => setRoute(btn.dataset.route)));

  // Click en cualquier parte del SVG (ruta visible) alterna
  root.querySelectorAll(".tflowRoute").forEach(g => {
    g.addEventListener("click", () => setRoute(g.dataset.route));
  });

  setRoute("inc");
})();

// =========================
// TFLOW: Tabs (Inc/Req)
// =========================
(function initTicketFlowTabs(){
  const root = document.getElementById("tflowTickets");
  if (!root) return;

  const tabs = root.querySelectorAll(".tflow__tab");

  function setRoute(route){
    root.classList.toggle("is-inc", route === "inc");
    root.classList.toggle("is-req", route === "req");

    tabs.forEach(btn => {
      const active = btn.dataset.route === route;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  }

  // clicks en botones
  tabs.forEach(btn => {
    btn.addEventListener("click", () => setRoute(btn.dataset.route));
  });

  // click en la rama visible del SVG (pro)
  root.querySelectorAll(".tflowRoute").forEach(g => {
    g.addEventListener("click", () => setRoute(g.dataset.route));
  });

  // default
  setRoute("inc");
})();