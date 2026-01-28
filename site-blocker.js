const fs = require('node:fs/promises');

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
    console.log(dataArr);
  } catch (error) {
    console.error('Error appending file: ', error);
  }
}
