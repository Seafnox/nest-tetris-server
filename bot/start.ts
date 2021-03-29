const { StaticPool } = require('node-worker-threads-pool');
const os = require('os')
const cpuCount = os.cpus().length

const start = async function startServer() {
  const filePath = './bot.js';
  const pool = new StaticPool({
    size: cpuCount - 1,
    task: filePath,
    workerData: {},
  });

  try {
    const result = await pool.exec();
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
}

start();
