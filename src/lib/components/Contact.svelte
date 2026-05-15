<script>
  import { onMount } from 'svelte';

  let form = { name: '', email: '', subject: '', message: '' };
  let errors = {};
  let status = 'idle'; // idle | loading | success | error
  let focusedField = null;

  function validate() {
    const e = {};
    if (!form.name.trim())                     e.name    = 'Name is required';
    if (!form.email.trim())                    e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.subject.trim())                  e.subject = 'Subject is required';
    if (!form.message.trim())                  e.message = 'Message is required';
    else if (form.message.trim().length < 20)  e.message = 'Message too short (min 20 chars)';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Sanitize
    const sanitized = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.replace(/[<>]/g, '')])
    );

    errors = validate();
    if (Object.keys(errors).length) return;

    status = 'loading';

    // Simulate API call (replace with your actual endpoint)
    await new Promise((res) => setTimeout(res, 1500));

    try {
      // Example: POST to a Netlify function / Formspree / your API
      // const res = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(sanitized)
      // });
      // if (!res.ok) throw new Error('Failed');

      status = 'success';
      form = { name: '', email: '', subject: '', message: '' };
      setTimeout(() => (status = 'idle'), 5000);
    } catch {
      status = 'error';
      setTimeout(() => (status = 'idle'), 5000);
    }
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('#contact .reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<section id="contact" class="section-padding relative overflow-hidden" aria-labelledby="contact-heading">
  <!-- Gradient backdrop -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"
       aria-hidden="true"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(245,158,11,0.05),transparent)]"
       aria-hidden="true"></div>

  <div class="relative max-w-6xl mx-auto">
    <!-- Heading -->
    <div class="reveal text-center mb-16">
      <p class="font-mono text-sm text-gold-400 tracking-widest uppercase mb-4">// Get In Touch</p>
      <h2 id="contact-heading" class="font-display font-bold text-5xl md:text-6xl text-white">
        Let's Build <span class="text-gradient">Together</span>
      </h2>
      <p class="mt-6 max-w-xl mx-auto text-white/50 leading-relaxed">
        Whether it's a project collab, a job opportunity, or just a technical chat —
        my inbox is always open.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
      <!-- Left: Contact info -->
      <div class="lg:col-span-2 space-y-6 reveal">
        {#each [
          {  label: 'Email', value: 'Temijeje@gmail.com', href: 'mailto:Temijeje@gmail.com' },
          {  label: 'GitHub', value: 'Temijopelo', href: 'https://github.com/temijopelo' },
          {  label: 'LinkedIn', value: 'Temijopelo Jeje', href: 'https://linkedin.com/temijopelo-jeje' },
          {  label: 'Twitter', value: '@jopejeje', href: 'https://twitter.com' }
        ] as info}
          <a
            href={info.href}
            target={info.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            class="group flex items-center gap-4 p-4 rounded-xl glass border border-white/8
                   hover:border-gold-500/40 hover:bg-gold-500/5 transition-all duration-200 cursor-none"
          >
           
            <div>
              <div class="font-mono text-xs text-white/30 uppercase tracking-widest mb-0.5">{info.label}</div>
              <div class="font-mono text-sm text-white/70 group-hover:text-gold-400 transition-colors">
                {info.value}
              </div>
            </div>
            <svg class="ml-auto w-4 h-4 text-white/20 group-hover:text-gold-400 transition-colors
                        group-hover:translate-x-1 transition-transform"
                 fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        {/each}

        <!-- Availability badge -->
        <div class="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="font-mono text-xs text-green-400 font-semibold">AVAILABLE NOW</span>
          </div>
          <p class="font-mono text-xs text-white/40">
            Open to full-time roles, freelance projects, and consulting.
            Typical response time: &lt;24h.
          </p>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="lg:col-span-3 reveal reveal-delay-2">
        <form
          on:submit={handleSubmit}
          novalidate
          class="glass rounded-2xl border border-white/10 p-8 space-y-6"
          aria-label="Contact form"
        >
          <!-- Name + Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Name field -->
            <div>
              <label for="name"
                     class="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
                Your Name <span class="text-gold-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                type="text"
                bind:value={form.name}
                on:focus={() => (focusedField = 'name')}
                on:blur={() => (focusedField = null)}
                placeholder="Jane Doe"
                autocomplete="name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
                       placeholder-white/20 outline-none transition-all duration-200 cursor-none
                       {errors.name  ? 'border-red-500/50 focus:border-red-400'
                         : focusedField === 'name' ? 'border-gold-500/60 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
                         : 'border-white/10 hover:border-white/20'}"
              />
              {#if errors.name}
                <p id="name-error" class="mt-1.5 text-xs text-red-400 font-mono" role="alert">
                  ⚠ {errors.name}
                </p>
              {/if}
            </div>

            <!-- Email field -->
            <div>
              <label for="email"
                     class="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
                Email Address <span class="text-gold-500" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                type="email"
                bind:value={form.email}
                on:focus={() => (focusedField = 'email')}
                on:blur={() => (focusedField = null)}
                placeholder="jane@example.com"
                autocomplete="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
                       placeholder-white/20 outline-none transition-all duration-200 cursor-none
                       {errors.email  ? 'border-red-500/50 focus:border-red-400'
                         : focusedField === 'email' ? 'border-gold-500/60 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
                         : 'border-white/10 hover:border-white/20'}"
              />
              {#if errors.email}
                <p id="email-error" class="mt-1.5 text-xs text-red-400 font-mono" role="alert">
                  ⚠ {errors.email}
                </p>
              {/if}
            </div>
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
              Subject <span class="text-gold-500" aria-hidden="true">*</span>
            </label>
            <input
              id="subject"
              type="text"
              bind:value={form.subject}
              on:focus={() => (focusedField = 'subject')}
              on:blur={() => (focusedField = null)}
              placeholder="Let's work together on..."
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
                     placeholder-white/20 outline-none transition-all duration-200 cursor-none
                     {errors.subject ? 'border-red-500/50'
                       : focusedField === 'subject' ? 'border-gold-500/60 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
                       : 'border-white/10 hover:border-white/20'}"
            />
            {#if errors.subject}
              <p id="subject-error" class="mt-1.5 text-xs text-red-400 font-mono" role="alert">⚠ {errors.subject}</p>
            {/if}
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
              Message <span class="text-gold-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              bind:value={form.message}
              on:focus={() => (focusedField = 'message')}
              on:blur={() => (focusedField = null)}
              placeholder="Tell me about your project, ideas, or just say hi..."
              rows="5"
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
                     placeholder-white/20 outline-none transition-all duration-200 resize-none cursor-none
                     {errors.message ? 'border-red-500/50'
                       : focusedField === 'message' ? 'border-gold-500/60 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
                       : 'border-white/10 hover:border-white/20'}"
            ></textarea>
            <div class="flex justify-between mt-1">
              {#if errors.message}
                <p id="message-error" class="text-xs text-red-400 font-mono" role="alert">⚠ {errors.message}</p>
              {:else}
                <span></span>
              {/if}
              <span class="font-mono text-xs text-white/20">{form.message.length}/500</span>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            class="w-full py-4 rounded-xl font-display font-semibold text-base transition-all duration-300
                   cursor-none disabled:opacity-60 disabled:cursor-not-allowed
                   {status === 'success' ? 'bg-green-500 text-white' :
                    status === 'error'   ? 'bg-red-500 text-white' :
                                           'bg-gold-500 text-obsidian-950 hover:bg-gold-400 glow-gold hover:scale-[1.02] active:scale-[0.98]'}"
            aria-live="polite"
          >
            {#if status === 'loading'}
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending…
              </span>
            {:else if status === 'success'}
              ✅ Message Sent! I'll reply within 24h.
            {:else if status === 'error'}
              ❌ Something went wrong. Try emailing directly.
            {:else}
              Send Message →
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
