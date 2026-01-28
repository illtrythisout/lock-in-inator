const fs = require('node:fs/promises');
const prompt = require('prompt-sync')({ sigint: true });

let blockedSites = ['youtube.com', 'instagram.com'];

async function readFile(file) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return data;
  } catch (error) {
    console.error('Error reading file: ', error);
  }
}
async function writeFile(file, content) {
  try {
    await fs.writeFile(file, content, 'utf8');
  } catch (error) {
    console.error('Error writing file: ', error);
  }
}

async function editHostsFile(blockedSites) {
  try {
    let content = await readFile('test.txt');
    let contentArr = content.split('# Blocked Sites by Distraction Blocker');

    // replace blocked sites section with those in the blocked sites array
    const newContent =
      contentArr[0] +
      '# Blocked Sites by Distraction Blocker\n' +
      blockedSites
        .map(
          (site) => '127.0.0.1 www.' + site + '\n' + '127.0.0.1 ' + site + '\n',
        )
        .join('') +
      '# Blocked Sites by Distraction Blocker' +
      contentArr[2];

    writeFile('test.txt', newContent);
  } catch (error) {
    console.error('Error updating hosts file: ', error);
  }
}

async function terminalInterface() {
  const welcomeText =
    '\u001b[1;36m' +
    'Site Blocker:' +
    '\n\u001b[0m' +
    '  Current Blocked Sites are:' +
    '\n\u001b[2m' +
    blockedSites.map((site) => '    ' + site + '\n').join('');
  console.log(welcomeText);

  // keep asking user until a correct input is given
  let userIsDone = false;
  while (!userIsDone) {
    // ask if the user wants to add or remove a url
    const addRemovePrompt = prompt(
      '\u001b[0m' +
        "  Press 'a' to add a site, 'r' to remove a site or 'q' to finish: ",
    );
    if (addRemovePrompt === 'a') {
      // push the inputted url
      const toAdd = prompt('\u001b[0m' + '  Write a URL to block: ');
      blockedSites.push(toAdd);
    } else if (addRemovePrompt == 'r') {
      // find and remove the inputted url
      const toRemove = prompt('\u001b[0m' + '  Write a URL to unblock: ');
      const index = blockedSites.indexOf(toRemove);
      // if index exists
      if (index > -1) blockedSites.splice(index, 1);
    } else if (addRemovePrompt === 'q') {
      // exit loop
      userIsDone = true;
    }

    // show list of blocked sites
    console.log(
      '\n\u001b[0m' +
        '  Current Blocked Sites are:' +
        '\n\u001b[2m' +
        blockedSites.map((site) => '    ' + site + '\n').join(''),
    );
    // update hosts file
    editHostsFile(blockedSites);
  }
}

terminalInterface();
