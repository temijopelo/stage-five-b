<script>
  import { onMount } from 'svelte';

  let x = -100, y = -100;
  let tx = -100, ty = -100;
  let clicking = false;
  let hovering = false;
  let raf;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    tx = lerp(tx, x, 0.15);
    ty = lerp(ty, y, 0.15);
    raf = requestAnimationFrame(tick);
  }

  onMount(() => {
    function move(e) { x = e.clientX; y = e.clientY; }
    function down()  { clicking = true; }
    function up()    { clicking = false; }

    function checkHover(e) {
      const el = e.target;
      hovering = !!(
        el.closest('a') ||
        el.closest('button') ||
        el.closest('input') ||
        el.closest('textarea') ||
        el.closest('[data-cursor-hover]')
      );
    }

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousemove', checkHover, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      cancelAnimationFrame(raf);
    };
  });
</script>

<!-- Only shown on pointer devices -->
<div class="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
  <!-- Dot -->
  <div
    class="absolute w-2 h-2 rounded-full bg-gold-400 -translate-x-1/2 -translate-y-1/2
           transition-transform duration-100
           {clicking ? 'scale-50' : 'scale-100'}"
    style="left: {x}px; top: {y}px;"
  ></div>

  <!-- Ring (lagged) -->
  <div
    class="absolute rounded-full border -translate-x-1/2 -translate-y-1/2
           transition-all duration-200
           {hovering ? 'w-14 h-14 border-gold-400/60 bg-gold-400/5' : 'w-8 h-8 border-white/20'}
           {clicking ? 'scale-75' : 'scale-100'}"
    style="left: {tx}px; top: {ty}px;"
  ></div>
</div>
