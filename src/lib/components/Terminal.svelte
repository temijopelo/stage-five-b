<script>
  import { onMount, tick } from 'svelte';

  /* ─── Command registry ─────────────────────────────────────── */
  const COMMANDS = {
    help: {
      desc: 'Show available commands',
      run: () => [
        { type: 'info', text: '┌─ Available Commands ────────────────────────────────┐' },
        ...Object.entries(COMMANDS).map(([cmd, { desc }]) => ({
          type: 'result',
          text: `  ${cmd.padEnd(14)} — ${desc}`
        })),
        { type: 'info', text: '└────────────────────────────────────────────────────┘' }
      ]
    },
    whoami: {
      desc: 'About me',
      run: () => [
        { type: 'result', text: '' },
        { type: 'result', text: '  👤  Your Name Here' },
        { type: 'result', text: '  🏙  Lagos, Nigeria' },
        { type: 'result', text: '  💼  Full-Stack Engineer' },
        { type: 'result', text: '  🎓  B.Sc Computer Science' },
        { type: 'result', text: '  ✉   you@example.com' },
        { type: 'result', text: '' }
      ]
    },
    skills: {
      desc: 'List my skills',
      run: () => [
        { type: 'info',   text: '' },
        { type: 'info',   text: '  ⚡ Frontend:  Svelte, React, TypeScript, CSS, GSAP' },
        { type: 'info',   text: '  🛠  Backend:   Node.js, Go, Python, PostgreSQL, Redis' },
        { type: 'info',   text: '  🐳 DevOps:    Docker, K8s, CI/CD, GitHub Actions' },
        { type: 'info',   text: '  🎨 Design:    Figma, UX, Accessibility (WCAG AA)' },
        { type: 'info',   text: '' }
      ]
    },
    projects: {
      desc: 'Show my top projects',
      run: () => [
        { type: 'result', text: '' },
        { type: 'result', text: '  🧠  NeuralDash    — AI monitoring dashboard (Svelte + Go)' },
        { type: 'result', text: '  🎨  PixelForge    — Browser pixel art editor (Canvas API)' },
        { type: 'result', text: '  🚀  Shipline      — CI/CD orchestrator (Node + Docker)' },
        { type: 'result', text: '  📋  TypeForm Clone — Conversational form builder (Vue 3)' },
        { type: 'result', text: '  🔍  DeepSearch    — Semantic code search CLI (Python)' },
        { type: 'result', text: '  🎯  Motif DS      — Design system 40+ components (Svelte)' },
        { type: 'result', text: '' }
      ]
    },
    contact: {
      desc: 'How to reach me',
      run: () => [
        { type: 'info', text: '' },
        { type: 'info', text: '  GitHub   → github.com/yourusername' },
        { type: 'info', text: '  LinkedIn → linkedin.com/in/yourusername' },
        { type: 'info', text: '  Twitter  → @yourusername' },
        { type: 'info', text: '  Email    → you@example.com' },
        { type: 'info', text: '' }
      ]
    },
    clear: {
      desc: 'Clear the terminal',
      run: 'CLEAR'
    },
    exit: {
      desc: 'Exit the terminal (just kidding 😄)',
      run: () => [{ type: 'warn', text: '  Nice try! You are stuck here forever. 👻' }]
    },
    sudo: {
      desc: 'Run as superuser',
      run: () => [{ type: 'error', text: '  sudo: Nice try, you are not in the sudoers file. This incident will be reported.' }]
    },
    coffee: {
      desc: 'Most important command',
      run: () => [
        { type: 'result', text: '' },
        { type: 'result', text: '  ( ()  )' },
        { type: 'result', text: "   \\ \\/" },
        { type: 'result', text: '    |  |~~~~~~' },
        { type: 'result', text: '    |  |       )' },
        { type: 'result', text: "    \\  |  ____/" },
        { type: 'result', text: "     \\ | /" },
        { type: 'result', text: '      \\|/' },
        { type: 'result', text: '' },
        { type: 'result', text: '  ☕ Coffee.exe is running. Productivity +200%.' },
        { type: 'result', text: '' }
      ]
    },
    date: {
      desc: 'Show current date',
      run: () => [{ type: 'result', text: `  ${new Date().toUTCString()}` }]
    },
    ls: {
      desc: 'List directory contents',
      run: () => [
        { type: 'result', text: '' },
        { type: 'result', text: '  drwxr-xr-x  projects/   skills/   contact/   resume.pdf' },
        { type: 'result', text: '' }
      ]
    }
  };

  const BOOT_LINES = [
    { type: 'info',   text: '╔══════════════════════════════════════════════════════╗' },
    { type: 'info',   text: '║        dev-portfolio v2.0.1  ·  SvelteKit            ║' },
    { type: 'info',   text: '╚══════════════════════════════════════════════════════╝' },
    { type: 'result', text: '' },
    { type: 'result', text: "  Welcome! I'm an interactive terminal for this portfolio." },
    { type: 'result', text: "  Type 'help' to see all available commands." },
    { type: 'result', text: '' }
  ];

  let lines = [...BOOT_LINES];
  let inputValue = '';
  let history = [];
  let historyIndex = -1;
  let inputEl;
  let terminalBody;
  let suggestions = [];

  function getSuggestions(val) {
    if (!val) return [];
    return Object.keys(COMMANDS).filter((k) => k.startsWith(val));
  }

  async function submit() {
    const cmd = inputValue.trim().toLowerCase();
    if (!cmd) return;

    // Echo command
    lines = [...lines, { type: 'cmd', text: `$ ${cmd}` }];
    history = [cmd, ...history.slice(0, 49)];
    historyIndex = -1;
    inputValue = '';
    suggestions = [];

    await tick();

    if (cmd in COMMANDS) {
      const result = COMMANDS[cmd].run;
      if (result === 'CLEAR') {
        lines = [...BOOT_LINES];
      } else {
        const output = typeof result === 'function' ? result() : [];
        lines = [...lines, ...output];
      }
    } else {
      lines = [...lines, { type: 'error', text: `  command not found: ${cmd}. Try 'help'.` }];
    }

    await tick();
    terminalBody?.scrollTo({ top: terminalBody.scrollHeight, behavior: 'smooth' });
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputValue = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputValue = history[historyIndex];
      } else {
        historyIndex = -1;
        inputValue = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const s = getSuggestions(inputValue);
      if (s.length === 1) inputValue = s[0];
    }
  }

  function handleInput() {
    suggestions = getSuggestions(inputValue);
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('#terminal .reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<section id="terminal" class="section-padding relative overflow-hidden" aria-labelledby="terminal-heading">
  <!-- bg accent -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(34,211,238,0.04),transparent)]"
       aria-hidden="true"></div>

  <div class="relative max-w-4xl mx-auto">
    <!-- Heading -->
    <div class="reveal text-center mb-12">
      <p class="font-mono text-sm text-electric-400 tracking-widest uppercase mb-4">// Interactive</p>
      <h2 id="terminal-heading" class="font-display font-bold text-5xl md:text-6xl text-white">
        Open <span class="text-gradient-cyan">Terminal</span>
      </h2>
      <p class="mt-4 text-white/40 font-mono text-sm">A real interactive terminal. Try typing <code class="text-electric-400">help</code></p>
    </div>

    <!-- Terminal window -->
    <div class="reveal reveal-delay-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl
                hover:border-white/20 transition-colors duration-300">
      <!-- Title bar -->
      <div class="flex items-center gap-2 px-5 py-3.5 bg-obsidian-800 border-b border-white/5">
        <span class="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-none"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-none"></span>
        <span class="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-none"></span>
        <span class="flex-1 text-center font-mono text-xs text-white/30">
          portfolio@devbox — bash — 80×24
        </span>
      </div>

      <!-- Body -->
      <div
        bind:this={terminalBody}
        class="bg-obsidian-900/90 p-5 h-96 overflow-y-auto font-mono text-sm leading-7"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {#each lines as line}
          <div class="whitespace-pre-wrap {
            line.type === 'cmd'    ? 'text-gold-400' :
            line.type === 'info'   ? 'text-electric-400' :
            line.type === 'error'  ? 'text-red-400' :
            line.type === 'warn'   ? 'text-yellow-400' :
                                     'text-white/70'
          }">
            {line.text}
          </div>
        {/each}

        <!-- Input row -->
        <div class="flex items-center gap-2 mt-1">
          <span class="text-gold-400 select-none" aria-hidden="true">$</span>
          <input
            bind:this={inputEl}
            bind:value={inputValue}
            on:keydown={handleKeydown}
            on:input={handleInput}
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            class="flex-1 bg-transparent text-white outline-none caret-gold-400 cursor-none"
            aria-label="Terminal input"
            placeholder="type a command…"
          />
          <span class="w-2 h-4 bg-gold-400 animate-blink" aria-hidden="true"></span>
        </div>
      </div>

      <!-- Suggestions bar -->
      {#if suggestions.length > 0}
        <div class="bg-obsidian-800/80 px-5 py-2 border-t border-white/5 flex gap-3" aria-label="Command suggestions">
          <span class="font-mono text-xs text-white/30">Tab:</span>
          {#each suggestions as s}
            <button
              on:click={() => { inputValue = s; inputEl?.focus(); }}
              class="font-mono text-xs text-electric-400 hover:text-white transition-colors cursor-none"
            >
              {s}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Quick commands -->
      <div class="bg-obsidian-800/50 px-5 py-3 border-t border-white/5 flex flex-wrap gap-2" aria-label="Quick commands">
        {#each ['help','whoami','projects','skills','contact','coffee'] as cmd}
          <button
            on:click={() => { inputValue = cmd; submit(); }}
            class="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/40
                   hover:bg-white/10 hover:text-white transition-all duration-150 cursor-none"
          >
            {cmd}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>
