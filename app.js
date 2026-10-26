// `spawn` starts a new OS process (the "child") from this Node process (the "parent").
// Unlike `exec`, it does not use a shell and streams output instead of buffering it,
// so it's safer with user input and works well for long-running or chatty commands.
const { spawn } = require('node:child_process');

// Runs a command in a child process and resolves with its stdout.
// Rejects if the process cannot start or exits with a non-zero code.
function runCommand(command, args = [], options = {}) {
  // Child processes are event-based, so we wrap them in a Promise to use async/await.
  return new Promise((resolve, reject) => {
    // Arguments are passed as an array, not one string. Each item reaches the
    // command as-is, so spaces or quotes in a prompt can't break the command.
    const child = spawn(command, args, {
      // stdio sets up the child's [stdin, stdout, stderr]:
      // - 'ignore': close stdin so CLIs like `claude -p` don't wait for piped input.
      // - 'pipe': connect stdout/stderr to streams we can read from here.
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    });

    let stdout = '';
    let stderr = '';

    // Output arrives in chunks (Buffers) as the child writes it, not all at once.
    // We append every chunk to build the full output.
    child.stdout.on('data', (chunk) => {stdout += chunk; console.log(stdout)});
    child.stderr.on('data', (chunk) => (stderr += chunk));

    // 'error' fires when the process could not start at all,
    // e.g. the command is not installed (ENOENT).
    child.on('error', reject);

    // 'close' fires after the process exits and all its streams are closed,
    // so by now `stdout` and `stderr` hold the complete output.
    child.on('close', (code) => {
      // By convention, exit code 0 means success and anything else means failure.
      if (code !== 0) {
        return reject(new Error(`${command} ${args.join(' ')} exited with ${code}: ${stderr.trim()}`));
      }
      resolve(stdout.trim());
    });
  });
}

// Simple example: run two git commands and print their output.
async function showGitInfo() {
  // URL of the "origin" remote, e.g. git@github.com:user/repo.git
  const remote = await runCommand('git', ['remote', 'get-url', 'origin']);
  // Current branch plus changed files, in a compact format.
  const status = await runCommand('git', ['status', '--short', '--branch']);

  console.log('Git remote:', remote);
  console.log('Git status:\n' + status);
}

// Advanced example: run the Claude Code CLI as a child process.
async function askClaude(prompt) {
  // -p (print mode) answers one prompt and exits instead of opening an interactive session.
  // --output-format json returns one JSON object with the answer and usage stats,
  // which is much easier to read in code than plain text.
  const output = await runCommand('claude', ['-p', prompt, '--output-format', 'json']);

  // The child sends back text, so we parse it into an object and pick the fields we need.
  const { result, usage, total_cost_usd, duration_ms } = JSON.parse(output);

  console.log('Claude answer:', result);
  console.log('Token usage:', {
    // New tokens sent to the model in this request.
    input: usage.input_tokens,
    // Tokens the model generated in its answer.
    output: usage.output_tokens,
    // Tokens reused from the prompt cache (cheap).
    cacheRead: usage.cache_read_input_tokens,
    // Tokens written to the prompt cache for later reuse (costs a bit more than normal input).
    cacheCreation: usage.cache_creation_input_tokens,
  });
  console.log(`Cost: $${total_cost_usd.toFixed(4)}, duration: ${duration_ms}ms`);
}

// Runs an async operation and prints the elapsed time every second until it finishes.
async function withTimer(operation) {
  let seconds = 0;

  // setInterval calls the callback every 1000ms. It runs on Node's event loop,
  // so it keeps ticking while we wait for the child process in the background.
  const timer = setInterval(() => {
    seconds++;
    console.log(`Elapsed: ${seconds}s`);
  }, 1000);

  try {
    return await operation();
  } finally {
    // `finally` runs on both success and failure, so the timer is always cleared.
    // Without this, the interval would keep Node alive and the script would never exit.
    clearInterval(timer);
  }
}

async function main() {
  // process.argv = ['node', '/path/to/app.js', ...extra args],
  // so the first argument the user typed is at index 2.
  const mode = process.argv[2] ?? 'git';

  if (mode === 'git') {
    await withTimer(showGitInfo);
  } else if (mode === 'claude') {
    // An optional custom prompt can be passed as the second argument.
    const prompt = process.argv[3] ?? 'Reply with one short sentence: what is a child process?';
    await withTimer(() => askClaude(prompt));
  } else {
    console.log('Usage: node app.js [git | claude ["prompt"]]');
  }
}

// Any rejected Promise from runCommand ends up here.
// Setting exitCode (instead of calling process.exit) lets Node finish
// pending work and exit cleanly with a failure code.
main().catch((err) => {
  console.error('Child process failed:', err.message);
  process.exitCode = 1;
});

// Exported so runCommand can be reused or tested with Jest.
module.exports = { runCommand };
