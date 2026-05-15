<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';

  let canvas;
  let container;
  let animationFrame;
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let mounted = false;

  const SOCIALS = [
    { name: 'GitHub',   href: 'https://github.com/temijopelo',   icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.026 2.748-1.026.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10z' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/temijopelo-jeje', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
    { name: 'Twitter',  href: 'https://twitter.com/jopejeje',   icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' }
  ];

  const roles = ['Front-end Developer', 'Frontend Craftsman', 'User Experience Expert'];
  let currentRole = 0;
  let displayedRole = '';
  let isDeleting = false;
  let typeInterval;

  function typeWriter() {
    const full = roles[currentRole];
    if (!isDeleting) {
      displayedRole = full.slice(0, displayedRole.length + 1);
      if (displayedRole === full) {
        setTimeout(() => { isDeleting = true; }, 2000);
      }
    } else {
      displayedRole = displayedRole.slice(0, -1);
      if (displayedRole === '') {
        isDeleting = false;
        currentRole = (currentRole + 1) % roles.length;
      }
    }
  }

  /* ── Particle system ─────────────────────────────────────── */
  class Particle {
    constructor(w, h) { this.reset(w, h); }
    reset(w, h) {
      this.x  = Math.random() * w;
      this.y  = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx / dist * 2;
        this.y += dy / dist * 2;
      }
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
  }

  function initCanvas() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const COUNT = Math.min(Math.floor((W * H) / 8000), 120);
    particles = Array.from({ length: COUNT }, () => new Particle(W, H));

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.update(W, H);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  function onMouseMove(e) {
    const rect = canvas?.getBoundingClientRect();
    if (rect) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
  }

  onMount(() => {
    mounted = true;
    initCanvas();

    // GSAP entrance animation
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.hero-tag',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .fromTo('.hero-name',   { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-role',   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-bio',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-cta',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .fromTo('.hero-social', { opacity: 0 },        { opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.2');

    // Typewriter
    typeInterval = setInterval(typeWriter, 100);

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(animationFrame);
      initCanvas();
    });
    if (canvas) resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
      clearInterval(typeInterval);
    };
  });
</script>

<section
  id="home"
  class="relative min-h-screen flex items-center justify-center overflow-hidden"
  on:mousemove={onMouseMove}
  aria-label="Hero section"
>
  <!-- Particle canvas -->
  <canvas
    bind:this={canvas}
    class="absolute inset-0 w-full h-full"
    aria-hidden="true"
  ></canvas>

  <!-- Radial gradient overlays -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),transparent)]" aria-hidden="true"></div>
  <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian-950 to-transparent" aria-hidden="true"></div>

  <!-- Content -->
  <div class="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
    <!-- Availability tag -->
    <div class="hero-tag inline-flex items-center gap-2 px-4 py-2 rounded-full glass
                border border-green-500/30 text-green-400 font-mono text-xs mb-8 opacity-0">
      <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
      Available for work · Open to opportunities
    </div>

    <!-- Name -->
    <h1 class="hero-name font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6 opacity-0">
      <span class="block text-white">Temijopelo</span>
      <span class="block text-gradient text-glow-gold">Jeje</span>
    </h1>

    <!-- Role typewriter -->
    <div class="hero-role font-mono text-xl md:text-2xl text-white/60 mb-6 h-8 opacity-0" aria-live="polite">
      <span class="text-electric-400">&gt;</span>
      <span class="ml-2">{displayedRole}</span>
      <span class="inline-block w-0.5 h-5 bg-gold-400 ml-0.5 animate-blink align-middle" aria-hidden="true"></span>
    </div>

    <!-- Bio -->
    <p class="hero-bio max-w-2xl mx-auto text-white/50 text-lg leading-relaxed mb-10 opacity-0">
      I craft digital experiences that live at the intersection of
      <span class="text-gold-400">engineering precision</span> and
      <span class="text-electric-400">creative imagination</span>.
      Building performant, accessible, and beautiful software.
    </p>

    <!-- CTAs -->
    <div class="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0">
      <button
        on:click={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
        class="group px-8 py-4 rounded-xl bg-gold-500 text-obsidian-950 font-display font-semibold
               text-base hover:bg-gold-400 transition-all duration-200 glow-gold
               hover:scale-105 active:scale-95 cursor-none"
      >
        View Projects
        <span class="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </button>
      <button
        on:click={() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })}
        class="group px-8 py-4 rounded-xl glass border border-white/10 text-white font-display font-semibold
               text-base hover:border-gold-500/50 hover:text-gold-400 transition-all duration-200 cursor-none"
      >
        <span class="font-mono text-electric-400">$</span> Open Terminal
      </button>
    </div>

    <!-- Social links -->
    <div class="flex items-center justify-center gap-6">
      {#each SOCIALS as social}
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          class="hero-social w-11 h-11 rounded-full glass flex items-center justify-center
                 text-white/40 hover:text-gold-400 hover:border-gold-500/50
                 border border-white/5 transition-all duration-200 hover:scale-110
                 opacity-0 cursor-none"
          aria-label={social.name}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={social.icon}/>
          </svg>
        </a>
      {/each}
    </div>
  </div>

  <!-- Scroll cue -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
    <span class="font-mono text-xs tracking-widest uppercase">Scroll</span>
    <div class="w-px h-12 bg-gradient-to-b from-gold-500/50 to-transparent animate-pulse"></div>
  </div>
</section>
