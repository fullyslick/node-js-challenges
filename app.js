// Requirements
//
// Event-loop lag monitor: use monitorEventLoopDelay from node:perf_hooks. Every 10 s, log p99 delay in ms, then reset. (Its values are in nanoseconds, so divide by 1e6.)
// Graceful shutdown on SIGTERM, following the shop-closing order from Drill 2:
// flip /ready to 503
// wait about 5 s
// server.close() to drain in-flight requests
// close a fake DB pool (await pool.end(), stub it)
// exit 0
// a hard-timeout safety net at 25 s that exits 1
import express from 'express';
import { monitorEventLoopDelay } from 'node:perf_hooks';

const app = express();
const pool = { end: async () => {} }; // stub DB pool
let shuttingDown = false;

app.get('/ready', (_req, res) => res.sendStatus(shuttingDown ? 503 : 200));

// 1. Event-loop lag monitor
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() => {
  console.log(`event-loop p99: ${(h.percentile(99) / 1e6).toFixed(1)} ms`);
  h.reset();
}, 10_000).unref(); // unref: don't keep the process alive just for this

const server = app.listen(3000);

// 2. Graceful shutdown
process.on('SIGTERM', async () => {
  if (shuttingDown) return;                                   // double-signal guard
  shuttingDown = true;                                        // /ready → 503
  setTimeout(() => process.exit(1), 25_000).unref();          // Without it, a pending timer keeps Node alive. The safety-net timer would block a clean exit, and the monitor interval would stop the process from ever exiting naturally.

  await new Promise(r => setTimeout(r, 5_000));               // let LB stop routing
  server.close(async (err) => {                               // drain in-flight
    try {
      await pool.end();                                       // close resources
      process.exit(err ? 1 : 0);
    } catch {
      process.exit(1);
    }
  });
  server.closeIdleConnections();                              // idle keep-alives
});
