const nextConfig = {
  outputFileTracingIncludes: {
    "/api/v1/migrations": ["./infra/migrations/**/*"],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

module.exports = nextConfig;
