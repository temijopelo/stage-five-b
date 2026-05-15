<script>
  const year = new Date().getFullYear();
</script>

<footer class="relative border-t border-white/5 py-12 px-6">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
    <!-- Brand -->
    <div class="font-display font-bold text-lg">
      <span class="text-gradient">&lt;</span>
      <span class="text-white">Temi</span>
      <span class="text-gradient">/&gt;</span>
    </div>

    <!-- Copyright -->
    <p class="font-mono text-xs text-white/25 text-center">
      © {year} Temi · Built with
      <a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer"
         class="text-orange-400/60 hover:text-orange-400 transition-colors cursor-none">SvelteKit</a>
      &
      <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer"
         class="text-cyan-400/60 hover:text-cyan-400 transition-colors cursor-none">Tailwind</a>
    </p>

    <!-- Back to top -->
    <button
      on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      class="font-mono text-xs text-white/30 hover:text-gold-400 transition-colors flex items-center gap-2 cursor-none"
      aria-label="Back to top"
    >
      Back to top
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  </div>
</footer>
