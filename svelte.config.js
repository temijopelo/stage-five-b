import vercel from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: vercel({
      // force a Node 18 runtime on Vercel
      runtime: "nodejs18.x",
    }),
  },
};

export default config;
