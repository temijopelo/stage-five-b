<script>
  import { onMount } from 'svelte';
  import { theme, toggleTheme } from '$lib/stores/theme.js';

  let scrolled = false;
  let menuOpen = false;
  let activeSection = 'home';

  const navLinks = [
    { id: 'home',     label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills',   label: 'Skills' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'contact',  label: 'Contact' }
  ];

  function handleScroll() {
    scrolled = window.scrollY > 60;

    // Determine active section
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
    for (let i = sections.length - 1; i >= 0; i--) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= 100) {
        activeSection = sections[i].id;
        break;
      }
    }
  }

  function scrollTo(id) {
    menuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 {scrolled
    ? 'py-3 glass border-b border-white/5 shadow-2xl'
    : 'py-6 bg-transparent'}"
  aria-label="Main navigation"
>
  <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
    <!-- Logo -->
    <button
      on:click={() => scrollTo('home')}
      class="font-display font-bold text-xl tracking-tight group cursor-none"
      aria-label="Go to top"
    >
      <span class="text-gradient">&lt;</span>
      <span class="text-white group-hover:text-gold-400 transition-colors">Temi</span>
      <span class="text-gradient">/&gt;</span>
    </button>

    <!-- Desktop nav -->
    <ul class="hidden md:flex items-center gap-8">
      {#each navLinks as link}
        <li>
          <button
            type="button"
            on:click={() => scrollTo(link.id)}
            class="font-mono text-sm cursor-none transition-all duration-200 underline-anim {activeSection === link.id
              ? 'text-gold-400 text-glow-gold'
              : 'text-white/60 hover:text-white'}"
          >
            {#if activeSection === link.id}
              <span class="text-gold-400 mr-1">›</span>
            {/if}
            {link.label}
          </button>
        </li>
      {/each}
    </ul>

    <!-- Actions -->
    <div class="flex items-center gap-4">
      <!-- Theme toggle -->
      <button
        on:click={toggleTheme}
        class="w-10 h-10 rounded-full glass flex items-center justify-center
               text-white/60 hover:text-gold-400 transition-all duration-200
               hover:glow-gold cursor-none"
        aria-label="Toggle theme"
      >
        {#if $theme === 'dark'}
          <!-- Sun icon -->
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        {:else}
          <!-- Moon icon -->
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>

      <!-- Resume button -->
      <a
        href="/resume.pdf"
        download
        class="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg
               border border-gold-500/50 text-gold-400 font-mono text-sm
               hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-200
               cursor-none focus-visible:ring-2 focus-visible:ring-gold-400"
        aria-label="Download resume"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Resume
      </a>

      <!-- Mobile hamburger -->
      <button
        on:click={() => (menuOpen = !menuOpen)}
        class="md:hidden w-10 h-10 flex flex-col justify-center gap-1.5 cursor-none"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span class="block h-0.5 bg-white transition-all duration-300 {menuOpen ? 'rotate-45 translate-y-2' : ''}"></span>
        <span class="block h-0.5 bg-white transition-all duration-300 {menuOpen ? 'opacity-0' : ''}"></span>
        <span class="block h-0.5 bg-white transition-all duration-300 {menuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if menuOpen}
    <div class="md:hidden glass border-t border-white/5 mt-3">
      <nav class="px-6 py-4 flex flex-col gap-4" aria-label="Mobile navigation">
        {#each navLinks as link}
          <button
            on:click={() => scrollTo(link.id)}
            class="text-left font-mono text-sm py-2 border-b border-white/5
                   {activeSection === link.id ? 'text-gold-400' : 'text-white/70'}
                   hover:text-white transition-colors cursor-none"
          >
            {link.label}
          </button>
        {/each}
        <a href="/resume.pdf" download class="text-gold-400 font-mono text-sm py-2 cursor-none">
          Download Resume ↓
        </a>
      </nav>
    </div>
  {/if}
</nav>
