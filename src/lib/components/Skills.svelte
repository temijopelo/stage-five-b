<script>
  import { onMount } from 'svelte';

  const SKILL_GROUPS = [
    {
      label: 'Frontend',
      icon: '⚡',
      color: '#f59e0b',
      skills: [
        { name: 'Svelte / SvelteKit', level: 95 },
        { name: 'React / Next.js',    level: 90 },
        { name: 'TypeScript',         level: 88 },
        { name: 'CSS / Tailwind',     level: 93 },
        { name: 'GSAP / Animations',  level: 82 }
      ]
    },
    {
      label: 'Backend',
      icon: '🛠',
      color: '#22d3ee',
      skills: [
        { name: 'Node.js / Express', level: 85 },
        { name: 'Go',                level: 72 },
        { name: 'Python / FastAPI',  level: 80 },
        { name: 'PostgreSQL',        level: 78 },
        { name: 'Redis',             level: 70 }
      ]
    },
    {
      label: 'Tooling & DevOps',
      icon: '🚀',
      color: '#a78bfa',
      skills: [
        { name: 'Docker / K8s',  level: 75 },
        { name: 'CI/CD (GH Actions)', level: 84 },
        { name: 'Vite / Webpack', level: 88 },
        { name: 'Testing (Vitest, Playwright)', level: 80 },
        { name: 'Linux / Bash',  level: 76 }
      ]
    }
  ];

  const TOOLS = [
    { name: 'Svelte',      emoji: '🧡' },
    { name: 'TypeScript',  emoji: '🔷' },
    { name: 'React',       emoji: '⚛️' },
    { name: 'Go',          emoji: '🐹' },
    { name: 'Python',      emoji: '🐍' },
    { name: 'Docker',      emoji: '🐳' },
    { name: 'PostgreSQL',  emoji: '🐘' },
    { name: 'Figma',       emoji: '🎨' },
    { name: 'Git',         emoji: '🌿' },
    { name: 'Vim',         emoji: '🟩' },
    { name: 'Tailwind',    emoji: '💨' },
    { name: 'GSAP',        emoji: '🎬' },
  ];

  let animated = false;
  let sectionEl;

  onMount(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !animated) {
            animated = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('#skills .reveal').forEach((el) => revealObserver.observe(el));
    if (sectionEl) barObserver.observe(sectionEl);

    return () => {
      revealObserver.disconnect();
      barObserver.disconnect();
    };
  });
</script>

<section id="skills" class="section-padding relative overflow-hidden" bind:this={sectionEl} aria-labelledby="skills-heading">
  <!-- Glow backdrop -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
              rounded-full opacity-5 pointer-events-none"
       style="background: radial-gradient(circle, #f59e0b 0%, transparent 70%);"
       aria-hidden="true">
  </div>

  <div class="relative max-w-7xl mx-auto">
    <!-- Heading -->
    <div class="reveal text-center mb-16">
      <p class="font-mono text-sm text-gold-400 tracking-widest uppercase mb-4">// Expertise</p>
      <h2 id="skills-heading" class="font-display font-bold text-5xl md:text-6xl text-white">
        Skills & <span class="text-gradient">Stack</span>
      </h2>
    </div>

    <!-- Skill groups -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
      {#each SKILL_GROUPS as group, gi}
        <div class="reveal" style="transition-delay: {gi * 0.1}s;">
          <div class="glass rounded-2xl border border-white/8 p-6 h-full hover:border-white/16 transition-colors duration-300">
            <!-- Group header -->
            <div class="flex items-center gap-3 mb-6">
              <span class="text-2xl" aria-hidden="true">{group.icon}</span>
              <h3 class="font-display font-semibold text-lg text-white">{group.label}</h3>
            </div>

            <!-- Skill bars -->
            <div class="space-y-5">
              {#each group.skills as skill, si}
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-mono text-sm text-white/70">{skill.name}</span>
                    <span class="font-mono text-xs" style="color: {group.color};">{skill.level}%</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/5 overflow-hidden" role="progressbar"
                       aria-valuenow={skill.level} aria-valuemin="0" aria-valuemax="100"
                       aria-label="{skill.name} proficiency {skill.level}%">
                    <div
                      class="h-full rounded-full transition-all duration-1000"
                      style="width: {animated ? skill.level : 0}%;
                             background: linear-gradient(90deg, {group.color}99, {group.color});
                             transition-delay: {si * 0.1 + gi * 0.15}s;
                             box-shadow: 0 0 8px {group.color}66;"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Tools / floating chips -->
    <div class="reveal">
      <h3 class="font-mono text-sm text-white/40 tracking-widest uppercase text-center mb-8">
        Tools I reach for every day
      </h3>
      <div class="flex flex-wrap gap-3 justify-center">
        {#each TOOLS as tool, i}
          <div
            class="group flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/8
                   hover:border-gold-500/40 hover:bg-gold-500/5 transition-all duration-200
                   hover:-translate-y-1 hover:shadow-lg cursor-none"
            style="animation: float {3 + (i % 4) * 0.5}s ease-in-out infinite; animation-delay: {i * 0.15}s;"
          >
            <span class="text-lg" aria-hidden="true">{tool.emoji}</span>
            <span class="font-mono text-sm text-white/60 group-hover:text-white transition-colors">
              {tool.name}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Stats row -->
    <div class="reveal mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
      {#each [
        { value: '3+',  label: 'Years Experience',  color: '#f59e0b' },
        { value: '20+', label: 'Projects Shipped',  color: '#22d3ee' },
        { value: '5k+', label: 'GitHub Commits',    color: '#a78bfa' },
        { value: '99',  label: 'Lighthouse Score',  color: '#34d399' }
      ] as stat}
        <div class="text-center glass rounded-2xl border border-white/8 p-6
                    hover:border-white/16 transition-colors duration-300">
          <div class="font-display font-bold text-4xl md:text-5xl mb-2"
               style="color: {stat.color}; text-shadow: 0 0 20px {stat.color}44;">
            {stat.value}
          </div>
          <div class="font-mono text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
        </div>
      {/each}
    </div>
  </div>
</section>
