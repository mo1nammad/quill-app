/** @type {import('next').NextConfig} */
const nextConfig = {
   redirects: async () => [
      { source: "/sign-in", destination: "/api/auth/login", permanent: true },
   ],
   webpack: (config) => {
      config.resolve.alias.canvas = false;

      return config;
   },
};

module.exports = nextConfig;
