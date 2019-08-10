/*
.##.....##....###....####.##....##
.###...###...##.##....##..###...##
.####.####..##...##...##..####..##
.##.###.##.##.....##..##..##.##.##
.##.....##.#########..##..##..####
.##.....##.##.....##..##..##...###
.##.....##.##.....##.####.##....##
*/

const { ipcRenderer } = require('electron');
const ppath = require('persist-path')('Ferny');
const fs = require("fs");
const isDarkColor = require("is-dark-color");

/*
.##.....##..#######..########..##.....##.##.......########..######.
.###...###.##.....##.##.....##.##.....##.##.......##.......##....##
.####.####.##.....##.##.....##.##.....##.##.......##.......##......
.##.###.##.##.....##.##.....##.##.....##.##.......######....######.
.##.....##.##.....##.##.....##.##.....##.##.......##.............##
.##.....##.##.....##.##.....##.##.....##.##.......##.......##....##
.##.....##..#######..########...#######..########.########..######.
*/

const applyBgColor = require("../modules/applyBgColor.js");
const applyBorderRadius = require("../modules/applyBorderRadius.js");
const loadBgColor = require("../modules/loadBgColor.js");
const loadBorderRadius = require("../modules/loadBorderRadius.js");

/*
.########.##.....##.##....##..######..########.####..#######..##....##..######.
.##.......##.....##.###...##.##....##....##.....##..##.....##.###...##.##....##
.##.......##.....##.####..##.##..........##.....##..##.....##.####..##.##......
.######...##.....##.##.##.##.##..........##.....##..##.....##.##.##.##..######.
.##.......##.....##.##..####.##..........##.....##..##.....##.##..####.......##
.##.......##.....##.##...###.##....##....##.....##..##.....##.##...###.##....##
.##........#######..##....##..######.....##....####..#######..##....##..######.
*/

function openLicenseFile() {
  ipcRenderer.send('request-open-license-file');
}

function loadAbout() {
  document.getElementById('about-electron').innerHTML = "Electron: v" + process.versions.electron;
  document.getElementById('about-chrome').innerHTML = "Chrome: v" + process.versions.chrome;
  document.getElementById('about-node').innerHTML = "Node: " + process.version;

  ipcRenderer.send('request-set-about');
}

function openIssuesPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://github.com/ModuleArt/ferny/issues");
}

function openDonatePage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://www.patreon.com/moduleart");
}

function openDeveloperPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://moduleart.github.io/");
}

function openAppPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://moduleart.github.io/ferny");
}

function openReleasesPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://github.com/ModuleArt/ferny/releases");
}

function openPlannerPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://trello.com/b/cb5lXUgS/ferny");
}

function openSourcePage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://github.com/ModuleArt/ferny");
}

function openElectronPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://electronjs.org/releases");
}

function openChromePage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://chromereleases.googleblog.com");
}

function openNodePage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://nodejs.org/en/download/releases");
}

function checkForUpdates() {
  ipcRenderer.send('request-check-for-updates');
}

/*
.####.########...######.....########..########.##....##.########..########.########..########.########.
..##..##.....##.##....##....##.....##.##.......###...##.##.....##.##.......##.....##.##.......##.....##
..##..##.....##.##..........##.....##.##.......####..##.##.....##.##.......##.....##.##.......##.....##
..##..########..##..........########..######...##.##.##.##.....##.######...########..######...########.
..##..##........##..........##...##...##.......##..####.##.....##.##.......##...##...##.......##...##..
..##..##........##....##....##....##..##.......##...###.##.....##.##.......##....##..##.......##....##.
.####.##.........######.....##.....##.########.##....##.########..########.##.....##.########.##.....##
*/

ipcRenderer.on('action-set-about', (event, arg) => {
  document.getElementById('about-app').innerHTML = "v" + arg.version + " / " + arg.arch + " / " + arg.platform;
});

/*
.####.##....##.####.########
..##..###...##..##.....##...
..##..####..##..##.....##...
..##..##.##.##..##.....##...
..##..##..####..##.....##...
..##..##...###..##.....##...
.####.##....##.####....##...
*/

function init() {
  applyBgColor(loadBgColor());
  applyBorderRadius(loadBorderRadius());

  loadAbout();
}

document.onreadystatechange = () => {
  if (document.readyState == "complete") {
      init();
  }
}

/*
.########.##.....##.########....########.##....##.########.
....##....##.....##.##..........##.......###...##.##.....##
....##....##.....##.##..........##.......####..##.##.....##
....##....#########.######......######...##.##.##.##.....##
....##....##.....##.##..........##.......##..####.##.....##
....##....##.....##.##..........##.......##...###.##.....##
....##....##.....##.########....########.##....##.########.
*/