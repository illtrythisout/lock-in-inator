const { link } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const prompt = require('prompt-sync')({ sigint: true });
require('dotenv').config();

// File Paths
const hostsFilePath =
  process.env.NODE_ENV === 'development' ? './test.txt' : '/etc/hosts';
const backupFilePath = hostsFilePath + '.backup';

// Markers
const beginMarker = '# BEGIN Distraction Blocker';
const endMarker = '# END Distraction Blocker';
const redirectTo = '127.0.0.1';

let blockedSites = [];

// Find needed content
function findBlockerSection(content) {
  const match = content.match(
    /(?<=# BEGIN Distraction Blocker\n)([\s\S]*?)(?=\n# END Distraction Blocker)/,
  );

  return match ? match[0] : null;
}
function getUrlsFromSection(content) {
  let links = content.split('\n');

  // get only the link part
  links = links
    .filter((link) => link.includes('127.0.0.1'))
    .map((link) => link.match(/(?<=127.0.0.1 ).*/)[0]);

  // only get the links that don't start with www.
  links = links.filter((link) => !link.includes('www.'));

  return links;
}

// Create a new blocker section
function createBlockerSection(sites) {
  let sitesInBlock = [];

  // Add the www. duplicates
  sites.forEach((site) => {
    sitesInBlock.push(site);
    sitesInBlock.push('www.' + site);
  });

  // Add the redirect link
  sitesInBlock = sitesInBlock.map((site) => redirectTo + ' ' + site);

  // Join the sites with a line break
  return sitesInBlock.join('\n');
}

async function readFile(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch (error) {
    console.error(`Error reading : ${file}`, error);
    process.exit(1);
  }
}
async function writeFile(file, content) {
  try {
    await fs.writeFile(file, content, 'utf8');
  } catch (error) {
    console.error(`Error writing ${file}: `, error);
  }
}

// User input validation
function normalizeUserInput(input) {
  return input
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '');
}
function isValidUserInput(input) {
  return /[a-zA-Z0-9@$%^&*()+/.:=?_'";,\\-]+/.test(input);
}

// Interface
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
      const data = prompt('\u001b[0m' + '  Write a URL to block: ');
      toAdd = normalizeUserInput(data);

      isValidUserInput(toAdd)
        ? blockedSites.push(toAdd)
        : console.log('\n\u001b[2m' + 'Invalid Input');
    }

    if (addRemovePrompt == 'r') {
      // find and remove the inputted url
      const toRemove = prompt('\u001b[0m' + '  Write a URL to unblock: ');
      const index = blockedSites.indexOf(toRemove);
      // if index exists
      if (index > -1) blockedSites.splice(index, 1);
    }

    if (addRemovePrompt === 'q') {
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
  }

  // update hosts file
}

// terminalInterface();
