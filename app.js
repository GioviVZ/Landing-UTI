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

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobile.style.display = "none";
      burger.setAttribute("aria-expanded", "false");
      mobile.setAttribute("aria-hidden", "true");
    });
  });
}

// Año footer
document.getElementById("year").textContent = new Date().getFullYear();

// Animación reveal (sutil, pro)
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.15 });

reveals.forEach(el => io.observe(el));