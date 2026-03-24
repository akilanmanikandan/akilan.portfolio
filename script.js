const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const interactiveNodes = document.querySelectorAll(".interactive");
const magneticNodes = document.querySelectorAll(".magnetic");
const revealNodes = document.querySelectorAll(".reveal");
const heroPanel = document.querySelector(".hero-panel");
const projectCards = document.querySelectorAll(".project");

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

function handleMagneticMove(event) {
  const node = event.currentTarget;
  const rect = node.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;
  node.style.transform = `translate(${offsetX * 0.08}px, ${offsetY * 0.08}px)`;
}

function resetMagnetic(event) {
  event.currentTarget.style.transform = "";
}

interactiveNodes.forEach((node) => {
  node.addEventListener("mouseenter", () => setCursorActive(true));
  node.addEventListener("mouseleave", () => setCursorActive(false));
});

magneticNodes.forEach((node) => {
  node.addEventListener("mousemove", handleMagneticMove);
  node.addEventListener("mouseleave", resetMagnetic);
});

projectCards.forEach((card) => {
  const toggle = card.querySelector(".project-toggle");
  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = card.classList.contains("open");

    projectCards.forEach((project) => {
      project.classList.remove("open");
      const button = project.querySelector(".project-toggle");
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });

    if (!isOpen) {
      card.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

window.addEventListener("mousemove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;

  if (heroPanel && window.innerWidth > 980) {
    const rect = heroPanel.getBoundingClientRect();
    const depthX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const depthY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    heroPanel.style.transform = `translate3d(${depthX * 10}px, ${depthY * 10}px, 0)`;
  }
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
