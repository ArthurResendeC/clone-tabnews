const { spawn, spawnSync } = require("node:child_process");

const lifecycle = process.argv[2]; // "dev" ou "test"
const npmCli = process.env.npm_execpath;

if (!lifecycle || !npmCli) {
  console.error("Use via npm: node infra/scripts/run-with-post.js <dev|test>");
  process.exit(1);
}

const npm = [npmCli, "run", "--silent"];

const child = spawn(process.execPath, [...npm, `${lifecycle}:start`], {
  stdio: "inherit",
});

// Ctrl+C já chega no filho pelo terminal/console; aqui só não podemos morrer.
process.on("SIGINT", () => {});
// SIGTERM (ex: `kill <pid>`) NÃO vai pro grupo inteiro, então repassamos.
process.on("SIGTERM", () => child.kill("SIGTERM"));

child.on("exit", (code, signal) => {
  const exitCode = code ?? 128 + (signal === "SIGINT" ? 2 : 15);

  // Com exit 0 o próprio npm roda o post<script>; senão, rodamos nós.
  if (exitCode !== 0) {
    spawnSync(process.execPath, [...npm, `post${lifecycle}`], {
      stdio: "inherit",
    });
  }

  process.exit(exitCode);
});
