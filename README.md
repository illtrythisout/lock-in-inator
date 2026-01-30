# Lock In-inator

A distraction blocker for macOS and Linux that allows users to block chosen domains.

### Supported platforms

**Supported:** macOS, Linux

**Not Supported:** Windows

## Setup

Make sure you have the latest version of **Node.js** installed

Clone the git repository on your computer:

```bash
git clone https://github.com/illtrythisout/lock-in-inator.git
```

Navigate to the directory and run:

```bash
npm install
```

### Set up a terminal shortcut to run

Run the following in the project directory:

```bash
chmod +x index.js
```

Then **replace the path to your correct path** and run:

```bash
sudo ln -s /absolute/path/to/your/project/index.js /usr/local/bin/lock-in
```

**Example:**

```bash
sudo ln -s /Users/john/Documents/lock-in-inator/index.js /usr/local/bin/lock-in
```

## How to run

Run the following anywhere:

```bash
sudo lock-in
```

**Or the following if the shortcut is not setup:**

Run the following in the project directory:

```bash
sudo node index.js
```

## Limitations

This script blocks domains by rerouting them to 127.0.0.1 (localhost). This means that the tool can only block **entire domains** and it is **not** possible to block specific paths like **instagram.com/reels** or **youtube.com/shorts**

## Safety

A backup of `/etc/hosts` is created before every run

To restore to the last backup run:

```bash
sudo cp /etc/hosts.backup /etc/hosts
```

To remove the changes made by this program, edit the contents of `/etc/hosts` and remove the section:

```txt
# BEGIN Distraction Blocker
your blocked links will be here
# END Distraction Blocker
```
