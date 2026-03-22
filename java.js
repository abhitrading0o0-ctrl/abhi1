document.addEventListener("DOMContentLoaded", () => {
  initHeaderOffset();
  initContactPage();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  });

  initPageLinks();
  initRevealAnimations();
  initHeroScroll();
  initTypingEffect();
  initParallax();
  initParticles();
});

function initHeaderOffset() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const applyOffset = () => {
    const offset = Math.ceil(header.getBoundingClientRect().height) + 12;
    document.documentElement.style.setProperty("--header-offset", `${offset}px`);
  };

  applyOffset();
  window.addEventListener("resize", applyOffset, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(applyOffset);
    observer.observe(header);
  }
}

function initPageLinks() {
  const links = Array.from(document.querySelectorAll("a[href]")).filter((link) => {
    const href = link.getAttribute("href");

    if (!href) {
      return false;
    }

    if (href.startsWith("#")) {
      return false;
    }

    if (link.target === "_blank" || link.hasAttribute("download")) {
      return false;
    }

    return href.endsWith(".html");
  });

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (link.href === window.location.href) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-leaving");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 320);
    });
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length) {
    return;
  }

  if (reduceMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    observer.observe(item);
  });
}

function initHeroScroll() {
  const button = document.querySelector("[data-scroll-target]");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scrollTarget);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
}

function initTypingEffect() {
  const lines = Array.from(document.querySelectorAll(".typed-line"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!lines.length) {
    return;
  }

  if (reduceMotion) {
    lines.forEach((line) => {
      line.textContent = line.dataset.text || "";
    });
    return;
  }

  let currentLine = 0;

  const typeLine = () => {
    const line = lines[currentLine];

    if (!line) {
      return;
    }

    const text = line.dataset.text || "";
    let currentChar = 0;

    const writeCharacter = () => {
      line.textContent = text.slice(0, currentChar + 1);
      currentChar += 1;

      if (currentChar < text.length) {
        const previousCharacter = text[currentChar - 1];
        const pause = previousCharacter === "." || previousCharacter === "," ? 70 : 28;
        window.setTimeout(writeCharacter, pause);
        return;
      }

      currentLine += 1;
      window.setTimeout(typeLine, 230);
    };

    writeCharacter();
  };

  typeLine();
}

function initParallax() {
  const layers = document.querySelectorAll(".parallax-layer");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!layers.length || reduceMotion) {
    return;
  }

  let ticking = false;

  const updateLayers = () => {
    const offset = window.scrollY;

    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed || 0);
      layer.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
    });

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateLayers);
    }
  };

  requestTick();
  window.addEventListener("scroll", requestTick, { passive: true });
}

function initParticles() {
  const fields = document.querySelectorAll(".particle-field");

  fields.forEach((field) => {
    const kind = field.dataset.particleKind || "orb";
    const count = Number(field.dataset.particleCount || 12);
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = `particle ${kind}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty("--duration", `${12 + Math.random() * 18}s`);
      particle.style.setProperty("--delay", `${-Math.random() * 20}s`);
      particle.style.setProperty("--x-shift", `${-18 + Math.random() * 36}px`);
      particle.style.setProperty("--particle-opacity", `${0.3 + Math.random() * 0.5}`);

      if (kind === "star") {
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
      }

      if (kind === "orb") {
        const size = 8 + Math.random() * 14;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
      }

      if (kind === "sparkle") {
        const size = 8 + Math.random() * 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
      }

      if (kind === "heart") {
        particle.style.fontSize = `${0.75 + Math.random() * 0.7}rem`;
      }

      fragment.appendChild(particle);
    }

    field.appendChild(fragment);
  });
}

function initContactPage() {
  const contactPage = document.querySelector("[data-contact-page]");

  if (!contactPage) {
    return;
  }

  const gateShell = contactPage.querySelector("[data-gate-shell]");
  const questionGroups = Array.from(contactPage.querySelectorAll(".question-options"));
  const gateNote = contactPage.querySelector("[data-gate-note]");
  const contactReveal = contactPage.querySelector("[data-contact-reveal]");
  const copyButton = contactPage.querySelector("[data-copy-number]");
  const copyNote = contactPage.querySelector("[data-copy-note]");
  const questionChoices = Array.from(contactPage.querySelectorAll(".question-choice"));

  const updateGate = () => {
    const allAnswered = questionGroups.length > 0 && questionGroups.every((group) => Boolean(group.querySelector(".question-choice:checked")));

    if (contactReveal) {
      contactReveal.classList.toggle("is-visible", allAnswered);
    }

    if (gateNote) {
      if (!allAnswered) {
        gateNote.textContent = "Answer all three questions to reveal the contact below.";
      } else {
        gateNote.textContent = "Thank you. The number is now visible below.";
      }
    }
  };

  questionGroups.forEach((group) => {
    const choices = Array.from(group.querySelectorAll(".question-choice"));

    choices.forEach((choice) => {
      choice.addEventListener("change", () => {
        updateGate();
      });
    });
  });

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const number = copyButton.dataset.number || "";

      if (!number) {
        return;
      }

      try {
        await navigator.clipboard.writeText(number);
        if (copyNote) {
          copyNote.textContent = "Number copied gently.";
        }
      } catch (error) {
        if (copyNote) {
          copyNote.textContent = "Copy did not work here, but the number is visible above.";
        }
      }
    });
  }

  if (gateShell) {
    gateShell.classList.remove("is-dimmed");
  }

  questionChoices.forEach((choice) => {
    choice.disabled = false;
  });

  updateGate();
}
