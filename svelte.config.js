import vercel from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: vercel({
      // force a Node 20 runtime on Vercel
      runtime: "nodejs20.x",
    }),
  },
};

export default config;
