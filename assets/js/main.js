/**
 * ============================================================================
 * AULAS DE BATERIA - SCRIPTS INTERATIVOS & ALTA CONVERSÃO
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CONFIGURAÇÕES PRINCIPAIS (Fácil edição para o cliente)
  const CONFIG = {
    // WhatsApp do professor Márcio Machado (formato internacional)
    whatsappNumber: '5533988492064',
    whatsappDefaultMessage: 'Olá, professor! Vi o anúncio das aulas particulares de bateria e gostaria de saber como funciona e quais horários estão disponíveis.',
    whatsappExperimentalMessage: 'Olá, professor! Gostaria de agendar uma aula experimental de bateria e conhecer o método!'
  };

  // Inicializa links de WhatsApp dinamicamente
  setupWhatsAppLinks(CONFIG);

  // Inicializa componentes
  setupHeaderScroll();
  setupFloatingWhatsAppScroll();
  setupMobileNav();
  setupClassCarousel();
  setupFaqAccordion();
  setupHeroParallax();
  setupSimpleVideoPlayer();
  setupSmoothScroll();
});

/**
 * Configura todos os botões e links do WhatsApp na página
 */
function setupWhatsAppLinks(config) {
  const ctaButtons = document.querySelectorAll('[data-wa-action]');
  
  ctaButtons.forEach(btn => {
    const actionType = btn.getAttribute('data-wa-action');
    let message = config.whatsappDefaultMessage;

    if (actionType === 'experimental') {
      message = config.whatsappExperimentalMessage;
    } else if (btn.getAttribute('data-wa-custom-msg')) {
      message = btn.getAttribute('data-wa-custom-msg');
    }

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;

    btn.setAttribute('href', waUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });
}

/**
 * Efeito visual no Header ao rolar a página
 */
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Menu Hamburguer Mobile
 */
function setupMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '&#9776;';
    });
  });
}

/**
 * Acordeão de Perguntas Frequentes (FAQ)
 */
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPane = item.querySelector('.faq-answer-pane');

    if (!questionBtn || !answerPane) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens para foco limpo
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherPane = otherItem.querySelector('.faq-answer-pane');
          if (otherPane) otherPane.style.maxHeight = null;
        }
      });

      // Alterna o item atual
      if (isActive) {
        item.classList.remove('active');
        answerPane.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
      }
    });
  });

  // Abre a primeira pergunta por padrão
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstPane = faqItems[0].querySelector('.faq-answer-pane');
    if (firstPane) firstPane.style.maxHeight = firstPane.scrollHeight + 'px';
  }
}

/**
 * Efeito Parallax suave no Card do Hero (somente desktop)
 */
function setupHeroParallax() {
  const heroCard = document.querySelector('.hero-image-card');
  const heroSection = document.querySelector('.hero-section');

  if (!heroCard || !heroSection || window.innerWidth < 1024) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xOffset = (clientX / innerWidth - 0.5) * 16;
    const yOffset = (clientY / innerHeight - 0.5) * 16;

    heroCard.style.transform = `perspective(1000px) rotateY(${xOffset}deg) rotateX(${-yOffset}deg) translateY(-4px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
  });
}

/**
 * Player de Vídeo Simples da Seção 4 ("Veja a bateria ganhar vida")
 */
function setupSimpleVideoPlayer() {
  const video = document.getElementById('drum-demo-video');
  const overlay = document.getElementById('video-play-overlay');

  if (!video || !overlay) return;

  // Clique no overlay inicia o vídeo
  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    video.play().catch(err => {
      console.log('Autoplay prevenido:', err);
    });
  });

  // Oculta o overlay quando o vídeo começa a rodar
  video.addEventListener('play', () => {
    overlay.classList.add('hidden');
  });

  // Mostra o overlay se o vídeo pausar no início ou terminar
  video.addEventListener('pause', () => {
    if (video.currentTime === 0 || video.ended) {
      overlay.classList.remove('hidden');
    }
  });

  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
  });
}



/**
 * Scroll Suave com compensação da barra de navegação fixa
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Controle de Navegação do Carrossel de Aulas
 */
function setupClassCarousel() {
  const track = document.getElementById('class-carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.class-card');
  let activeIndex = 0;

  function highlightCard(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.style.borderColor = 'rgba(245, 158, 11, 0.9)';
        card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.35)';
      } else {
        card.style.borderColor = 'rgba(245, 158, 11, 0.22)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    highlightCard(activeIndex);
    if (window.innerWidth <= 768) {
      cards[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });

  nextBtn.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % cards.length;
    highlightCard(activeIndex);
    if (window.innerWidth <= 768) {
      cards[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

/**
 * Controla a visibilidade e o esmaecimento suave do botão flutuante do WhatsApp
 * Invisível na Hero e surgindo suavemente até ficar 100% sólido ao rolar até a 2ª seção
 */
function setupFloatingWhatsAppScroll() {
  const floatingWa = document.querySelector('.floating-whatsapp');
  const heroSection = document.querySelector('.hero-section');
  const secondSection = document.querySelector('#aulas') || document.querySelector('.section-objections');
  
  if (!floatingWa || !heroSection) return;

  const updateVisibility = () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    // Início do fade (a partir de 35% da hero) e término do fade sólido (ao atingir a 2ª seção)
    const fadeStart = heroHeight * 0.35;
    const fadeEnd = secondSection ? Math.max(secondSection.offsetTop - 180, heroHeight * 0.75) : heroHeight * 0.8;

    if (scrollY <= fadeStart) {
      floatingWa.style.opacity = '0';
      floatingWa.style.visibility = 'hidden';
      floatingWa.style.pointerEvents = 'none';
      floatingWa.style.transform = 'translateY(20px) scale(0.85)';
    } else if (scrollY >= fadeEnd) {
      floatingWa.style.opacity = '1';
      floatingWa.style.visibility = 'visible';
      floatingWa.style.pointerEvents = 'auto';
      floatingWa.style.transform = 'translateY(0) scale(1)';
    } else {
      // Interpolação suave e progressiva de opacidade e escala
      const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
      const easedProgress = Math.min(Math.max(progress, 0), 1);
      const translateY = 20 * (1 - easedProgress);
      const scale = 0.85 + (0.15 * easedProgress);

      floatingWa.style.opacity = easedProgress.toFixed(3);
      floatingWa.style.visibility = 'visible';
      floatingWa.style.pointerEvents = easedProgress > 0.5 ? 'auto' : 'none';
      floatingWa.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
    }
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  updateVisibility(); // Execução inicial para garantir estado correto ao carregar
}

