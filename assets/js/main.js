/**
 * ============================================================================
 * AULAS DE BATERIA - SCRIPTS INTERATIVOS & ALTA CONVERSÃO
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CONFIGURAÇÕES PRINCIPAIS (Fácil edição para o cliente)
  const CONFIG = {
    // Altere este número para o WhatsApp real do professor (formato internacional sem + ou caracteres especiais)
    whatsappNumber: '5533999999999',
    whatsappDefaultMessage: 'Olá, professor! Vi o anúncio das aulas particulares de bateria e gostaria de saber como funciona e quais horários estão disponíveis.',
    whatsappExperimentalMessage: 'Olá, professor! Gostaria de agendar uma aula experimental de bateria e conhecer o método!'
  };

  // Inicializa links de WhatsApp dinamicamente
  setupWhatsAppLinks(CONFIG);

  // Inicializa componentes
  setupHeaderScroll();
  setupMobileNav();
  setupClassCarousel();
  setupFaqAccordion();
  setupHeroParallax();
  setupVideoDemoModal();
  setupWebAudioDrumMachine();
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
 * Modal Interativo de Vídeo e Demonstração Sonora
 */
function setupVideoDemoModal() {
  const videoCard = document.querySelector('.video-player-container');
  const modalBackdrop = document.querySelector('.video-modal-backdrop');
  const closeBtn = document.querySelector('.video-modal-close');

  if (!videoCard || !modalBackdrop) return;

  const openModal = () => {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    // Pausa o ritmo sonoro se estiver tocando
    if (window.drumAudioState && window.drumAudioState.isPlaying) {
      window.drumAudioState.stop();
    }
  };

  videoCard.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Sintetizador Real de Bateria com Web Audio API (Demonstração Sonora Realística)
 */
function setupWebAudioDrumMachine() {
  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;
  let currentStep = 0;
  let tempo = 105; // BPM do Groove

  const playBtn = document.getElementById('btn-play-groove');
  const eqBars = document.querySelectorAll('.eq-bar');
  const grooveSelector = document.getElementById('groove-style-select');

  if (!playBtn) return;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sons sintéticos de bateria ultra-realistas via Web Audio API
  function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.4);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  function playSnare(time) {
    // Noise buffer
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    noise.connect(filter);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.8, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    // Corpo do tambor (Tone)
    const osc = audioCtx.createOscillator();
    const toneGain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
    toneGain.gain.setValueAtTime(0.6, time);
    toneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(toneGain);
    toneGain.connect(audioCtx.destination);

    noise.start(time);
    osc.start(time);
    noise.stop(time + 0.2);
    osc.stop(time + 0.15);
  }

  function playHiHat(time, open = false) {
    const bufferSize = audioCtx.sampleRate * (open ? 0.35 : 0.05);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6500;
    noise.connect(filter);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + (open ? 0.35 : 0.05));

    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(time);
    noise.stop(time + (open ? 0.35 : 0.05));
  }

  // Padrões de Groove de 16 semicolcheias
  const GROOVES = {
    rock: {
      kick:  [1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 1, 0,  0, 0, 0, 0],
      snare: [0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0],
      hihat: [1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0]
    },
    funk: {
      kick:  [1, 0, 0, 1,  0, 0, 1, 0,  0, 1, 0, 0,  1, 0, 0, 0],
      snare: [0, 0, 0, 0,  1, 0, 0, 1,  0, 0, 1, 0,  1, 0, 0, 1],
      hihat: [1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1]
    }
  };

  let selectedStyle = 'rock';
  if (grooveSelector) {
    grooveSelector.addEventListener('change', (e) => {
      selectedStyle = e.target.value;
    });
  }

  function stepScheduler() {
    const stepTime = (60 / tempo) / 4;
    const now = audioCtx.currentTime;
    const pattern = GROOVES[selectedStyle] || GROOVES.rock;

    if (pattern.kick[currentStep]) playKick(now);
    if (pattern.snare[currentStep]) playSnare(now);
    if (pattern.hihat[currentStep]) playHiHat(now, currentStep === 14);

    currentStep = (currentStep + 1) % 16;
  }

  function startGroove() {
    initAudio();
    isPlaying = true;
    currentStep = 0;
    const intervalMs = ((60 / tempo) / 4) * 1000;
    timerId = setInterval(stepScheduler, intervalMs);
    
    playBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      Pausar Groove de Demonstração
    `;
    playBtn.classList.add('playing');
    eqBars.forEach(bar => bar.classList.add('animating'));
  }

  function stopGroove() {
    isPlaying = false;
    if (timerId) clearInterval(timerId);
    timerId = null;

    playBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      Ouvir Groove da Bateria ao Vivo
    `;
    playBtn.classList.remove('playing');
    eqBars.forEach(bar => bar.classList.remove('animating'));
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopGroove();
    } else {
      startGroove();
    }
  });

  // Exporta estado para fechar quando modal fecha
  window.drumAudioState = {
    isPlaying: () => isPlaying,
    stop: stopGroove
  };
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

