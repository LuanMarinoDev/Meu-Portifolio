// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
  // Loader inicial
  const loader = document.getElementById("loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        document.body.classList.add("loaded");
      }, 500);
    }, 1000);
  });

  // CURSOR CUSTOMIZADO REMOVIDO
  // A seção inteira do cursor customizado foi removida para eliminar o pontinho azul

  // Partículas flutuantes
  function createParticles() {
    const particlesContainer = document.getElementById("particles");

    if (window.innerWidth <= 768) return; // Não criar partículas em mobile

    setInterval(() => {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.left = Math.random() * window.innerWidth + "px";
      particle.style.animationDuration = Math.random() * 3 + 3 + "s";

      particlesContainer.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 6000);
    }, 300);
  }

  createParticles();

  // Indicador de scroll
  const scrollIndicator = document.getElementById("scroll-indicator");

  window.addEventListener("scroll", () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;

    scrollIndicator.style.width = scrolled + "%";
  });

  // Menu Mobile Toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Fecha o menu mobile quando clica em um link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Scroll suave para navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header com efeito de scroll
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
      header.style.background = "rgba(13, 13, 13, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.3)";
    } else {
      header.classList.remove("scrolled");
      header.style.background = "rgba(13, 13, 13, 0.95)";
      header.style.boxShadow = "none";
    }
  });

  // Sistema de observação de elementos para animações
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Animação especial para skill cards
        if (entry.target.classList.contains("skill-card")) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      }
    });
  }, observerOptions);

  // Observa elementos para animação
  document
    .querySelectorAll(".skill-card, .education-item, .about-text p")
    .forEach((el) => {
      observer.observe(el);
    });

  // Efeito de tilt nos skill cards (apenas desktop)
  if (window.innerWidth > 768) {
    document.querySelectorAll(".skill-card[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-15px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) scale(1) translateY(0)";
      });
    });
  }

  // Sistema de notificações
  function showNotification(message, type = "info") {
    // Remove notificação existente
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Cria nova notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Adiciona ao DOM
    document.body.appendChild(notification);

    // Evento de fechar
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    });

    // Auto remove após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Formulário de contato (se existir)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Validação básica
      if (!name || !email || !message) {
        showNotification("Por favor, preencha todos os campos!", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Por favor, insira um e-mail válido!", "error");
        return;
      }

      // Simula envio do formulário
      showNotification(
        "Mensagem enviada com sucesso! Entrarei em contato em breve.",
        "success"
      );
      contactForm.reset();
    });
  }

  // Função para validar e-mail
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Highlight da navegação ativa
  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.clientHeight;

      if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // Parallax suave para o hero
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero && window.innerWidth > 768) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Efeito de digitação no título
  function typeWriter(element, text, speed = 100) {
    if (!element || window.innerWidth <= 768) return; // Não aplicar em mobile

    let i = 0;
    element.innerHTML = "";
    element.style.borderRight = "3px solid var(--azul-claro)";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Remove o cursor após completar
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }
    type();
  }

  // Ativa o efeito de digitação após um pequeno delay
  setTimeout(() => {
    const heroTitle = document.querySelector(".typewriter");
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 80);
    }
  }, 2000);

  // Animação de entrada suave para elementos
  const fadeElements = document.querySelectorAll(
    ".subtitle, .description, .hero-buttons"
  );
  fadeElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";

    setTimeout(() => {
      el.style.transition = "opacity 1s ease, transform 1s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 500 + index * 200);
  });

  // Efeito de hover melhorado nos botões
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Smooth reveal para textos da seção about
  const aboutTexts = document.querySelectorAll(".about-text p");

  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 200);
        }
      });
    },
    { threshold: 0.5 }
  );

  aboutTexts.forEach((text) => {
    textObserver.observe(text);
  });

  // Performance: desabilita alguns efeitos em dispositivos com baixa performance
  const isLowPerformanceDevice = () => {
    return (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  };

  if (isLowPerformanceDevice()) {
    // Desabilita animações pesadas
    document.documentElement.style.setProperty("--animation-duration", "0.3s");

    // Remove partículas
    const particles = document.getElementById("particles");
    if (particles) particles.style.display = "none";

    // Simplifica animações de hover
    document.querySelectorAll(".skill-card").forEach((card) => {
      card.addEventListener("touchstart", function () {
        this.style.transform = "scale(1.02)";
      });

      card.addEventListener("touchend", function () {
        this.style.transform = "scale(1)";
      });
    });
  }

  // Log de inicialização
  console.log("🚀 Portfólio do Luan Bravin Marino carregado com sucesso!");
  console.log("✨ Efeitos visuais ativados!");

  // Easter egg
  console.log(
    "%c Olá, dev curioso! 👋",
    "color: #74b9ff; font-size: 16px; font-weight: bold;"
  );
  console.log(
    "%c Se você está vendo isso, provavelmente tem interesse em código!",
    "color: #1e5fa3; font-size: 12px;"
  );
  console.log(
    "%c Entre em contato: luanmarino40@gmail.com",
    "color: #74b9ff; font-size: 14px;"
  );
});
