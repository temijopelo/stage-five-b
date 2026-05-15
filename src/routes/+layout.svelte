<script>
  import '../app.css';
  import Nav    from '$lib/components/Nav.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { theme } from '$lib/stores/theme.js';
</script>

<!-- Skip navigation for keyboard users -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
         focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold-500 focus:text-obsidian-950
         focus:font-mono focus:text-sm focus:font-semibold"
>
  Skip to main content
</a>

<Cursor />
<Nav />

<main id="main-content" tabindex="-1">
  <slot />
</main>

<Footer />
