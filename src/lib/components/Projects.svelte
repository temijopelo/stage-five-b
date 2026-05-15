<script>
  import { onMount } from 'svelte';

  const PROJECTS = [
    {
      id: 1,
      title: 'NeuralDash',
      description: 'Real-time AI model monitoring dashboard with streaming metrics, WebSocket data, and interactive visualizations. Handles 50k+ events/sec.',
      long: 'Built to solve the problem of opaque ML model behavior in production. Features real-time anomaly detection, customizable alert thresholds, and a timeline scrubber for historical analysis. Processes 50k+ events per second through a Go backend connected via WebSocket.',
      category: 'fullstack',
      tags: ['SvelteKit', 'Go', 'WebSocket', 'PostgreSQL', 'D3.js'],
      color: '#f59e0b',
      demo: '#',
      repo: '#',
      emoji: '🧠'
    },
    {
      id: 2,
      title: 'PixelForge',
      description: 'Browser-based pixel art editor with layers, animation timeline, and one-click sprite sheet export. Zero dependencies.',
      long: 'A fully featured pixel art tool built on the Canvas API without any third-party dependencies. Supports 32 layers, 60fps animation preview, palette management, and exports to PNG sprite sheets and GIF. Ships as a PWA with offline support.',
      category: 'frontend',
      tags: ['Svelte', 'Canvas API', 'PWA', 'IndexedDB'],
      color: '#22d3ee',
      demo: '#',
      repo: '#',
      emoji: '🎨'
    },
    {
      id: 3,
      title: 'Shipline',
      description: 'CI/CD pipeline orchestrator with visual DAG editor, secret management, and Slack/GitHub integrations.',
      long: 'Replaced a labyrinthine Jenkins setup. Features a drag-and-drop DAG editor for pipeline definition, encrypted secret storage, parallel step execution, and rich notification integrations. Reduced deployment time by 60%.',
      category: 'fullstack',
      tags: ['Node.js', 'React', 'Docker', 'Redis', 'PostgreSQL'],
      color: '#a78bfa',
      demo: '#',
      repo: '#',
      emoji: '🚀'
    },
    {
      id: 4,
      title: 'Typeform Clone',
      description: 'Conversational form builder with conditional logic, custom themes, and embeddable widget SDK.',
      long: 'A from-scratch conversational form builder. Drag-and-drop field editor, 12 question types, conditional branching, response analytics, and an embeddable <1KB iframe SDK. Used by 3 product teams internally.',
      category: 'frontend',
      tags: ['Vue 3', 'TypeScript', 'Vite', 'Pinia'],
      color: '#34d399',
      demo: '#',
      repo: '#',
      emoji: '📋'
    },
    {
      id: 5,
      title: 'DeepSearch CLI',
      description: 'AI-powered semantic code search CLI that understands intent, not just keywords. Works on any codebase.',
      long: 'Uses OpenAI embeddings to index your codebase and retrieve semantically relevant snippets. Supports fuzzy matching, regex, and natural-language queries. Integrates with VSCode and Neovim as an LSP plugin.',
      category: 'backend',
      tags: ['Python', 'OpenAI', 'FAISS', 'Click', 'SQLite'],
      color: '#f87171',
      demo: '#',
      repo: '#',
      emoji: '🔍'
    },
    {
      id: 6,
      title: 'Motif Design System',
      description: 'Accessible, token-driven component library with 40+ components. Theming, dark mode, and Storybook docs.',
      long: 'A production-ready design system built from scratch with accessibility as a first-class concern. Every component passes WCAG AA. Ships with a design token pipeline (Figma → CSS), Storybook documentation, and a zero-runtime CSS-in-JS solution.',
      category: 'frontend',
      tags: ['Svelte', 'Storybook', 'WCAG AA', 'Design Tokens'],
      color: '#fb923c',
      demo: '#',
      repo: '#',
      emoji: '🎯'
    }
  ];

  const CATEGORIES = [
    { key: 'all',      label: 'All Projects' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'fullstack',label: 'Full-Stack' },
    { key: 'backend',  label: 'Backend' }
  ];

  let activeFilter = 'all';
  let selectedProject = null;

  function handleModalKeydown(event) {
    if (event.key === 'Escape') {
      selectedProject = null;
    }
  }
  let cards = [];

  $: filtered = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  // 3D tilt on hover
  function handleTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -20;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`;
  }
  function resetTilt(card) {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  }

  // Scroll reveal
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    document.querySelectorAll('#projects .reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<section id="projects" class="section-padding relative" aria-labelledby="projects-heading">
  <!-- Background grid -->
  <div class="absolute inset-0 opacity-[0.03]"
       style="background-image: linear-gradient(rgba(245,158,11,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px);
              background-size: 60px 60px;"
       aria-hidden="true">
  </div>

  <div class="relative max-w-7xl mx-auto">
    <!-- Heading -->
    <div class="reveal mb-16 text-center">
      <p class="font-mono text-sm text-gold-400 tracking-widest uppercase mb-4">// Selected Work</p>
      <h2 id="projects-heading" class="font-display font-bold text-5xl md:text-6xl text-white">
        Projects That <span class="text-gradient">Ship</span>
      </h2>
    </div>

    <!-- Filter tabs -->
    <div class="reveal reveal-delay-1 flex flex-wrap gap-3 justify-center mb-12" role="tablist" aria-label="Project filters">
      {#each CATEGORIES as cat}
        <button
          role="tab"
          aria-selected={activeFilter === cat.key}
          on:click={() => (activeFilter = cat.key)}
          class="px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-200 cursor-none
                 {activeFilter === cat.key
                   ? 'bg-gold-500 text-obsidian-950 font-semibold shadow-lg glow-gold'
                   : 'glass text-white/60 hover:text-white border border-white/10'}"
        >
          {cat.label}
        </button>
      {/each}
    </div>

    <!-- Project grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
      {#each filtered as project (project.id)}
        <article
          class="reveal reveal-delay-2 group relative rounded-2xl glass border border-white/8
                 overflow-hidden transition-all duration-300 hover:border-white/20 cursor-none"
          style="transition-property: transform, box-shadow; transition-duration: 300ms;"
          on:mousemove={(e) => handleTilt(e, e.currentTarget)}
          on:mouseleave={(e) => resetTilt(e.currentTarget)}
          role="listitem"
        >
          <!-- Top accent bar -->
          <div class="h-1 w-full" style="background: {project.color}; opacity: 0.8;"></div>

          <div class="p-6">
            <!-- Emoji + category -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl" role="img" aria-label={project.title}>{project.emoji}</span>
              <span class="font-mono text-xs px-3 py-1 rounded-full border text-white/40"
                    style="border-color: {project.color}33; color: {project.color};">
                {project.category}
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-display font-bold text-xl text-white mb-2 group-hover:text-gold-400
                       transition-colors duration-200">
              {project.title}
            </h3>

            <!-- Description -->
            <p class="text-white/50 text-sm leading-relaxed mb-5">{project.description}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              {#each project.tags as tag}
                <span class="font-mono text-xs px-2 py-1 rounded bg-white/5 text-white/40">
                  {tag}
                </span>
              {/each}
            </div>

            <!-- Links -->
            <div class="flex gap-3">
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                 class="flex-1 text-center py-2 rounded-lg text-xs font-mono font-medium
                        transition-all duration-200 cursor-none
                        hover:opacity-90"
                 style="background: {project.color}22; color: {project.color}; border: 1px solid {project.color}44;">
                Live Demo ↗
              </a>
              <a href={project.repo} target="_blank" rel="noopener noreferrer"
                 class="flex-1 text-center py-2 rounded-lg text-xs font-mono font-medium
                        glass border border-white/10 text-white/50 hover:text-white
                        transition-all duration-200 cursor-none">
                GitHub ↗
              </a>
              <button
                on:click={() => (selectedProject = project)}
                class="px-3 py-2 rounded-lg glass border border-white/10 text-white/50
                       hover:text-white hover:border-white/30 transition-all duration-200 cursor-none text-xs"
                aria-label="Read more about {project.title}"
              >
                ···
              </button>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<!-- Project Modal -->
{#if selectedProject}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="relative max-w-2xl w-full rounded-2xl glass border border-white/10 overflow-hidden
                shadow-2xl animate-fadeInUp">
      <!-- Accent bar -->
      <div class="h-1 w-full" style="background: {selectedProject.color};"></div>

      <div class="p-8">
        <!-- Close -->
        <button
          on:click={() => (selectedProject = null)}
          class="absolute top-6 right-6 w-8 h-8 rounded-full glass flex items-center justify-center
                 text-white/40 hover:text-white transition-colors cursor-none"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div class="flex items-center gap-3 mb-6">
          <span class="text-4xl">{selectedProject.emoji}</span>
          <div>
            <h3 id="modal-title" class="font-display font-bold text-2xl text-white">{selectedProject.title}</h3>
            <span class="font-mono text-xs" style="color: {selectedProject.color};">{selectedProject.category}</span>
          </div>
        </div>

        <p class="text-white/70 leading-relaxed mb-6">{selectedProject.long}</p>

        <div class="flex flex-wrap gap-2 mb-8">
          {#each selectedProject.tags as tag}
            <span class="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/50">{tag}</span>
          {/each}
        </div>

        <div class="flex gap-4">
          <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer"
             class="flex-1 text-center py-3 rounded-xl font-mono font-semibold text-sm
                    transition-all duration-200 cursor-none"
             style="background: {selectedProject.color}; color: #080a0f;">
            View Live Demo ↗
          </a>
          <a href={selectedProject.repo} target="_blank" rel="noopener noreferrer"
             class="flex-1 text-center py-3 rounded-xl glass border border-white/15
                    text-white font-mono text-sm hover:border-white/30 transition-all duration-200 cursor-none">
            View on GitHub ↗
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleModalKeydown} />
