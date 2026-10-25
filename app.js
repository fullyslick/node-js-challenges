const fs = require('fs');

function schedule(label) {
  console.log(`[${label}] sync start`); // 1

  setTimeout(() => {
    console.log(`[${label}] setTimeout 0`);
  }, 0);

  setImmediate(() => {
    console.log(`[${label}] setImmediate`);
  });

  Promise.resolve().then(() => {
    console.log(`[${label}] promise.then`);
  });

  process.nextTick(() => {
    console.log(`[${label}] process.nextTick`);
  });

  console.log(`[${label}] sync end`);
}

schedule('main');

fs.readFile(__filename, () => {
  schedule('readFile');
});



