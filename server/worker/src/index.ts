const tickMs = Number(process.env.WORKER_TICK_MS ?? 15000);

const runTick = () => {
  console.log(`[worker] heartbeat at ${new Date().toISOString()}`);
};

const timer = setInterval(runTick, tickMs);
runTick();

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`[worker] received ${signal}, shutting down`);
  clearInterval(timer);
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
