const ORG_URL = "assets/data/org_inia.json";


const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6VCOaxqzAXsO1Hjzrk1C-lCkry3EjVLwzkvgyplwS3MlT5zKdgABAV8af8B4ldO8tOQ/exec";

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

const clearBtn = document.getElementById("clearComments");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("¿Eliminar todos los comentarios?")) {
      localStorage.removeItem("inia_sugerencias");
      location.reload();
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "inia_sugerencias";

  const frmSugerencia = document.getElementById("frmSugerencia");
  const commentsList = document.getElementById("commentsList");
  const emptyComments = document.getElementById("emptyComments");
  const msgSugerencia = document.getElementById("msgSugerencia");
  const clearBtn = document.getElementById("clearComments");

  const sugNombre = document.getElementById("sugNombre");
  const sugArea = document.getElementById("sugArea");
  const sugTipo = document.getElementById("sugTipo");
  const sugMensaje = document.getElementById("sugMensaje");

  function setSugMsg(type, text) {
    if (!msgSugerencia) return;
    msgSugerencia.className = "alert" + (type ? ` alert--${type}` : "");
    msgSugerencia.textContent = text || "";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function getComments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveComments(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getTypeClass(tipo) {
    const t = (tipo || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (t === "comentario") return "commentCard__type--comentario";
    if (t === "sugerencia") return "commentCard__type--sugerencia";
    if (t === "felicitacion") return "commentCard__type--felicitacion";
    return "";
  }

  function formatDate(isoDate) {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function renderComments() {
    if (!commentsList) return;

    const comments = getComments();
    commentsList.innerHTML = "";

    if (!comments.length) {
      commentsList.innerHTML = `
        <div class="emptyComments" id="emptyComments">
          Aún no hay comentarios publicados. Sé el primero en dejar una sugerencia.
        </div>
      `;
      return;
    }

    const sorted = [...comments].reverse();

    sorted.forEach((item) => {
      const card = document.createElement("article");
      card.className = "commentCard";

      card.innerHTML = `
        <div class="commentCard__head">
          <div class="commentCard__author">
            <strong>${escapeHtml(item.nombre)}</strong>
            <span class="commentCard__meta">
              ${escapeHtml(item.area || "Área no indicada")} • ${escapeHtml(formatDate(item.fecha))}
            </span>
          </div>
          <span class="commentCard__type ${getTypeClass(item.tipo)}">
            ${escapeHtml(item.tipo)}
          </span>
        </div>
        <p>${escapeHtml(item.mensaje)}</p>
      `;

      commentsList.appendChild(card);
    });
  }

  if (frmSugerencia) {
    frmSugerencia.addEventListener("submit", (e) => {
      e.preventDefault();
      setSugMsg("", "");

      const data = {
        nombre: sugNombre?.value.trim() || "",
        area: sugArea?.value.trim() || "",
        tipo: sugTipo?.value || "",
        mensaje: sugMensaje?.value.trim() || "",
        fecha: new Date().toISOString()
      };

      if (!data.nombre) {
        setSugMsg("warn", "Ingresa tu nombre.");
        return;
      }

      if (!data.tipo) {
        setSugMsg("warn", "Selecciona el tipo de mensaje.");
        return;
      }

      if (!data.mensaje) {
        setSugMsg("warn", "Escribe tu comentario o sugerencia.");
        return;
      }

      const comments = getComments();
      comments.push(data);
      saveComments(comments);

      frmSugerencia.reset();
      renderComments();
      setSugMsg("ok", "✅ Comentario guardado correctamente.");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const comments = getComments();
      if (!comments.length) {
        setSugMsg("info", "No hay comentarios para eliminar.");
        return;
      }

      const ok = confirm("¿Deseas eliminar todos los comentarios guardados en este navegador?");
      if (!ok) return;

      localStorage.removeItem(STORAGE_KEY);
      renderComments();
      setSugMsg("ok", "Comentarios eliminados correctamente.");
    });
  }

  renderComments();
});