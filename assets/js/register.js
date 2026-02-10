const ORG_URL = "assets/data/org_inia.json";

// ✅ Pega aquí tu URL del Apps Script /exec
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1234567890/exec";

const $ = (id) => document.getElementById(id);

const frm = $("frmRegistro");
const msg = $("msg");
const sedeSel = $("sede");
const depSel = $("dependencia");
const subSel = $("subdependencia");

let ORG = null;

function setMsg(type, text) {
  if (!msg) return;
  msg.className = "alert " + (type ? `alert--${type}` : "");
  msg.textContent = text || "";
}

function isValidDNI(dni) {
  return /^[0-9]{8}$/.test((dni || "").trim());
}

function isValidIniaEmail(email) {
  return /^[a-z0-9._%+-]+@inia\.gob\.pe$/i.test((email || "").trim());
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function fillSelect(select, items) {
  if (!select) return;
  select.innerHTML =
    `<option value="">Seleccione…</option>` +
    items.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
}

async function loadOrg() {
  const res = await fetch(ORG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar org_inia.json");
  ORG = await res.json();

  const sedes = Object.keys(ORG).sort((a, b) => a.localeCompare(b, "es"));
  fillSelect(sedeSel, sedes);
}

if (sedeSel) {
  sedeSel.addEventListener("change", () => {
    if (depSel) depSel.disabled = true;
    if (subSel) subSel.disabled = true;
    fillSelect(depSel, []);
    fillSelect(subSel, []);

    const sede = sedeSel.value;
    if (!sede || !ORG?.[sede]) return;

    const deps = Object.keys(ORG[sede]).sort((a, b) => a.localeCompare(b, "es"));
    fillSelect(depSel, deps);
    if (depSel) depSel.disabled = false;
  });
}

if (depSel) {
  depSel.addEventListener("change", () => {
    if (subSel) subSel.disabled = true;
    fillSelect(subSel, []);

    const sede = sedeSel?.value;
    const dep = depSel.value;
    if (!sede || !dep || !ORG?.[sede]?.[dep]) return;

    const subs = ORG[sede][dep];
    const finalSubs = (subs && subs.length) ? subs : ["—"];
    fillSelect(subSel, finalSubs);
    if (subSel) subSel.disabled = false;
  });
}

if (frm) {
  frm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("", "");

    // Honeypot anti-bot
    if ($("website")?.value?.trim()) {
      return setMsg("error", "Solicitud no válida.");
    }

    // reCAPTCHA token (v2 checkbox)
    const token =
      (window.grecaptcha && typeof grecaptcha.getResponse === "function")
        ? grecaptcha.getResponse()
        : "";

    if (!token) return setMsg("warn", "Completa el CAPTCHA antes de enviar.");

    const data = {
      nombres: $("nombres")?.value?.trim() || "",
      apellidos: $("apellidos")?.value?.trim() || "",
      dni: $("dni")?.value?.trim() || "",
      correo: $("correo")?.value?.trim() || "",
      sede: sedeSel?.value || "",
      dependencia: depSel?.value || "",
      subdependencia: subSel?.value || "",
      detalle: $("detalle")?.value?.trim() || "",
      website: $("website")?.value?.trim() || "",
      recaptchaToken: token,
      tipo: "REGISTRO_USUARIO_MESA_AYUDA",
      origen: window.location.href,
      fecha: new Date().toISOString()
    };

    if (!data.nombres || !data.apellidos) return setMsg("warn", "Completa nombres y apellidos.");
    if (!isValidDNI(data.dni)) return setMsg("warn", "DNI inválido. Debe tener 8 dígitos.");
    if (!isValidIniaEmail(data.correo)) return setMsg("warn", "Correo inválido. Debe ser del dominio @inia.gob.pe");
    if (!data.sede || !data.dependencia || !data.subdependencia) return setMsg("warn", "Completa Sede, Dependencia y Subdependencia.");
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PEGA_AQUI")) return setMsg("warn", "Falta configurar APPS_SCRIPT_URL (Web App).");

    try {
      setMsg("info", "Enviando solicitud…");

      // CORS friendly: no-cors (Apps Script igual recibe y envía)
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
        mode: "no-cors"
      });

      frm.reset();
      if (depSel) depSel.disabled = true;
      if (subSel) subSel.disabled = true;
      fillSelect(depSel, []);
      fillSelect(subSel, []);

      if (window.grecaptcha && typeof grecaptcha.reset === "function") grecaptcha.reset();

      setMsg("ok", "✅ Solicitud enviada. La UTI creará tu usuario y recibirás tus credenciales en tu correo institucional.");
    } catch (err) {
      if (window.grecaptcha && typeof grecaptcha.reset === "function") grecaptcha.reset();
      setMsg("error", "❌ No se pudo enviar. Intenta nuevamente.");
    }
  });
}

// Init
loadOrg().catch(() => setMsg("error", "No se pudo cargar la organización (org_inia.json)."));