const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const interactiveNodes = document.querySelectorAll(".interactive");
const revealNodes = document.querySelectorAll(".reveal");
const credentialItems = document.querySelectorAll("[data-credential-src]");
const credentialModal = document.querySelector(".credential-modal");
const credentialViewer = document.querySelector(".credential-viewer");
const credentialFrame = document.querySelector(".credential-frame");
const tiltCards = document.querySelectorAll(
  ".hero-card, .hero-metrics, .featured-case, .timeline-item, .project, .certification-item, .skill-block, .fact, .contact-section, .credential-viewer"
);

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let ringX = cursorX;
let ringY = cursorY;

function animateCursor() {
  ringX += (cursorX - ringX) * 0.18;
  ringY += (cursorY - ringY) * 0.18;

  if (cursorDot && cursorRing) {
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  requestAnimationFrame(animateCursor);
}

function createClickBurst(x, y) {
  const burst = document.createElement("span");
  burst.className = "click-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 650);
}

function setCursorActive(active) {
  if (!cursorRing) {
    return;
  }
  cursorRing.classList.toggle("active", active);
}

interactiveNodes.forEach((node) => {
  node.addEventListener("mouseenter", () => setCursorActive(true));
  node.addEventListener("mouseleave", () => setCursorActive(false));
});

function attachTilt(card) {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 980) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 12;
    const rotateX = (0.5 - y) * 12;

    card.style.setProperty("--glow-x", `${x * 100}%`);
    card.style.setProperty("--glow-y", `${y * 100}%`);
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.removeProperty("--glow-x");
    card.style.removeProperty("--glow-y");
  });
}

tiltCards.forEach((card) => attachTilt(card));

function openCredential(card) {
  if (!credentialModal || !credentialFrame) {
    return;
  }

  const src = card.dataset.credentialSrc;
  const title = card.dataset.credentialTitle || "Credential preview";

  credentialFrame.replaceChildren();

  const image = document.createElement("img");
  image.src = src;
  image.alt = title;
  credentialFrame.appendChild(image);

  credentialModal.classList.add("open");
  credentialModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("credential-open");
}

function closeCredential() {
  if (!credentialModal || !credentialFrame || !credentialViewer) {
    return;
  }

  credentialModal.classList.remove("open");
  credentialModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("credential-open");
  credentialViewer.style.transform = "";
  credentialViewer.style.removeProperty("--glow-x");
  credentialViewer.style.removeProperty("--glow-y");
  window.setTimeout(() => {
    if (!credentialModal.classList.contains("open")) {
      credentialFrame.replaceChildren();
    }
  }, 220);
}

credentialItems.forEach((card) => {
  card.addEventListener("click", () => openCredential(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCredential(card);
    }
  });
});

if (credentialModal) {
  credentialModal.addEventListener("click", (event) => {
    if (event.target === credentialModal) {
      closeCredential();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && credentialModal?.classList.contains("open")) {
    closeCredential();
  }
});

window.addEventListener("mousemove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
});

window.addEventListener("click", (event) => {
  createClickBurst(event.clientX, event.clientY);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealNodes.forEach((node) => observer.observe(node));

if (window.innerWidth > 980) {
  animateCursor();
}
