# 🌐 Landing Page Mesa de Ayuda UTI – INIA

Proyecto web desarrollado para presentar y orientar a los usuarios del **Instituto Nacional de Innovación Agraria (INIA)** sobre el uso de la **Mesa de Ayuda institucional**, incluyendo servicios TI, guías de uso, tutoriales y un sistema de registro de usuario.

Este proyecto fue desarrollado como parte del curso **Taller de Programación Web**, integrando **HTML, CSS y JavaScript** para crear una interfaz moderna, responsiva e interactiva.

---

# 🎯 Objetivo del Proyecto

Desarrollar una **landing page informativa e interactiva** que permita a los usuarios del INIA:

- Conocer los servicios que ofrece la **Unidad de Tecnología de la Información (UTI)**.
- Acceder fácilmente al sistema oficial de **Mesa de Ayuda**.
- Aprender cómo registrar tickets correctamente.
- Visualizar tutoriales y buenas prácticas de seguridad informática.
- Enviar comentarios o sugerencias para mejorar el servicio.
- Solicitar el **registro de usuario** para acceder a la plataforma.

---

# 👥 Público Objetivo

El sistema está dirigido a:

- Personal administrativo del INIA
- Investigadores
- Técnicos de campo
- Usuarios de estaciones experimentales agrarias
- Personal que requiere soporte tecnológico

---

# 🧱 Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura del sitio web |
| CSS3 | Diseño visual y estilos responsivos |
| JavaScript | Interactividad y manejo de formularios |
| Google reCAPTCHA | Seguridad en el formulario de registro |
| Google Apps Script | Recepción de solicitudes de registro |
| LocalStorage | Almacenamiento de comentarios del usuario |

---

# 📁 Estructura del Proyecto
project/
│
├── index.html
│
├── assets
│
├── css
│   └── styles.css
│
├── js
│   ├── app.js
│   └── register.js
│
├── data
│   └── org_inia.json
│
├── img
│   └── logos / imágenes

### Descripción de archivos

| Archivo | Función |
|-------|--------|
| **index.html** | Estructura principal del sitio |
| **styles.css** | Diseño visual y estilos del sistema |
| **app.js** | Funciones generales del sitio (menú, animaciones, navegación) |
| **register.js** | Gestión del formulario de registro y comentarios |
| **org_inia.json** | Estructura de sedes, dependencias y subdependencias |

---

# 🖥️ Secciones del Sitio Web

El sitio está compuesto por las siguientes secciones principales:

### 🏠 Hero
Presentación de la Mesa de Ayuda y su objetivo dentro del INIA.

### 🧰 Servicios UTI
Describe las áreas de soporte:

- Soporte técnico
- Redes y conectividad
- Seguridad informática
- Sistemas institucionales

### 📄 Guía de Tickets
Explica paso a paso cómo registrar correctamente:

- Incidencias
- Requerimientos

### 🎥 Tutoriales
Videos informativos sobre:

- Instalación de AnyDesk
- Seguridad informática
- Prevención de phishing

### 💬 Comentarios y sugerencias
Permite a los usuarios publicar comentarios o sugerencias.

Los comentarios se almacenan usando **LocalStorage del navegador**.

### ❓ Preguntas Frecuentes (FAQ)
Responde dudas comunes sobre el uso de la Mesa de Ayuda.

### 👤 Registro de Usuario
Formulario que permite solicitar un usuario para acceder al sistema.

Este formulario incluye:

- Validación de DNI
- Validación de correo institucional
- Selección de sede y dependencia
- Verificación con **Google reCAPTCHA**

---

# ⚙️ Funcionalidades JavaScript

El sistema incluye las siguientes funcionalidades dinámicas:

### 📱 Navegación responsive
Menú adaptable a dispositivos móviles.

### 🎭 Animaciones Reveal
Elementos que aparecen suavemente al hacer scroll.

### 🧠 Formulario dinámico de registro
Carga automática de:

- Sedes
- Dependencias
- Subdependencias

mediante el archivo `org_inia.json`.

### 🔐 Seguridad
Implementación de:

- reCAPTCHA
- Honeypot anti-bots

### 💬 Sistema de comentarios
Permite:

- Publicar comentarios
- Mostrar comentarios en pantalla
- Guardar comentarios en LocalStorage
- Eliminar comentarios manualmente

---

# 📊 Diseño Responsivo

El sitio fue diseñado para adaptarse a distintos dispositivos:

- 💻 Escritorio
- 📱 Teléfonos móviles
- 📲 Tablets

Utilizando:

- Grid Layout
- Media Queries
- Flexbox

---

# 🚀 Cómo Ejecutar el Proyecto

1️⃣ Clonar el repositorio

```bash
git clone https://github.com/usuario/repositorio.git

2️⃣ Abrir la carpeta del proyecto

3️⃣ Ejecutar el archivo
index.html
🔮 Mejoras Futuras

Posibles mejoras del proyecto:
	•	Integrar base de datos para comentarios
	•	Panel administrativo de tickets
	•	Autenticación de usuarios
	•	Dashboard de métricas
	•	Sistema completo de mesa de ayuda
	•	API de gestión de tickets
	•	Integración con sistemas institucionales


📄 Licencia

Proyecto académico desarrollado con fines educativos.