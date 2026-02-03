const prompt = require('prompt-sync')({ sigint: true });

function doTimedFunction(blockedSites, duration) {
  const n = prompt('Write: ');
  if (n == '') return console.log('Empty');
  console.log(n);
}

doTimedFunction();
