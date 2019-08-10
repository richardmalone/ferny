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

const saveFileToJsonFolder = require("../modules/saveFileToJsonFolder.js");
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

function requestLastTab(lastTab) {
  saveFileToJsonFolder('lasttab', lastTab);
}

function requestBookmarksBar(on, layout) {
  if(on != null) {
    if(on) {
      on = 1;
    } else {
      on = 0;
    }
  }

  let Data = {
    on: on,
    layout: layout
  };

  ipcRenderer.send('request-set-bookmarks-bar', Data);
}

function scrollToId(id) {
  document.getElementById(id).scrollIntoView({
	  	behavior: 'smooth'
	});
}

function requestSearchEngine(engine) {
  ipcRenderer.send('request-set-search-engine', engine);
}

function requestTheme(color) {
  ipcRenderer.send('request-change-theme', color);
  applyBgColor(color);
}

function requestBorderRadius(size) {
  ipcRenderer.send('request-change-border-radius', size);
  applyBorderRadius(size);
}

function changeWelcome(bool) {
  if(bool) {
    saveFileToJsonFolder('welcome', 1);
  } else {
    saveFileToJsonFolder('welcome', 0);
  }
}

function loadStartPage() {
  try {
    var startPage = fs.readFileSync(ppath + "/json/startpage.json");
    document.getElementById('start-page-input').value = startPage;
  } catch (e) {

  }
}

function loadHomePage() {
  try {
    var jsonstr = fs.readFileSync(ppath + "/json/home.json");
    Data = JSON.parse(jsonstr);
    document.getElementById('home-page-input').value = Data.url;
    if(Data.on == 1) {
      document.getElementById('home-page-checkbox').checked = true;
    }
  } catch (e) {

  }
}

function saveHomePage() {
  var url = document.getElementById('home-page-input').value;
  var on = document.getElementById('home-page-checkbox').checked;

  if(url.length <= 0) {
    notif("First enter the home page URL", "warning");
  } else {
    if(on) {
      on = 1;
    } else {
      on = 0;
    }
  
    if(!fs.existsSync(ppath + "/json")) {
      fs.mkdirSync(ppath + "/json");
    } 
    saveFileToJsonFolder('home', JSON.stringify({ url: url, on: on }));

    notif("Home page saved", "success");

    ipcRenderer.send('request-update-home-page');
  }
}

function loadSearchEngine() {
  try {
    var searchEngine = fs.readFileSync(ppath + "/json/searchengine.json");

    var radios = document.getElementsByName("search-engine");
    for(var i = 0; i < radios.length; i++) {
      if(radios[i].value == searchEngine) {
        radios[i].checked = true;
        break;
      }
    }
  } catch (e) {

  }
}

function showWelcomeScreen() {
  ipcRenderer.send("request-show-welcome-screen");
}

function saveStartPage() {
  var startPage = document.getElementById('start-page-input').value;

  saveFileToJsonFolder('startpage', startPage);

  notif("Start page saved: " + startPage, "success");

  ipcRenderer.send('request-set-start-page', startPage);
}

function notif(text, type) {
  let Data = {
    text: text,
    type: type
  };
  ipcRenderer.send('request-notif', Data)
}

function moreInfo(btn) {
  btn.classList.toggle('active');
  btn.nextElementSibling.classList.toggle('active');
}

function loadWelcome() {
  try {
    var welcomeOn = fs.readFileSync(ppath + "/json/welcome.json");
    if(welcomeOn == 1) {
      document.getElementById('welcome-checkbox').checked = true;
    } else {
      document.getElementById('welcome-checkbox').checked = false;
    }
  } catch (e) {

  }
}

function loadBookmarksBar() {
  try {
    var jsonstr = fs.readFileSync(ppath + "/json/bookmarksbar.json");
    let Data = JSON.parse(jsonstr);

    if(Data.on) {
      document.getElementById('bookmarks-bar-checkbox').checked = true;
    }

    var radios = document.getElementsByName("bbar-layout");
    for(var i = 0; i < radios.length; i++) {
      if(radios[i].value == Data.layout) {
        radios[i].checked = true;
        break;
      }
    }
  } catch (e) {

  }
}

function loadLastTab() {
  var lastTab = "new-tab";
  
  try {
    lastTab = fs.readFileSync(ppath + "/json/lasttab.json");
  } catch (e) {
    saveFileToJsonFolder("lasttab", lastTab);
  }
  var radios = document.getElementsByName("last-tab");
  for(var i = 0; i < radios.length; i++) {
    if(radios[i].value == lastTab) {
      radios[i].checked = true;
      break;
    }
  }
}

function loadCache() {
  ipcRenderer.send('request-set-cache-size');
}

function bytesToSize(bytes) {
  var sizes = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function clearBrowsingData() {
  // var clearHistory = document.getElementById('clear-history-checkbox').checked;
  var clearCache = document.getElementById('clear-cache-checkbox').checked;
  var clearStorage = document.getElementById('clear-storage-checkbox').checked;
  // var clearAuth = document.getElementById('clear-auth-checkbox').checked;

  // if(clearHistory) {
  //   try {
  //     fs.writeFileSync(ppath + "/json/history.json", "");
  //   } catch (error) {
  
  //   }
  // }

  let Data = {
    cache: clearCache,
    storage: clearStorage
    // auth: clearAuth
  };

  ipcRenderer.send('request-clear-browsing-data', Data);
}

function setStartPageLikeHomePage() {
  try {
    var jsonstr = fs.readFileSync(ppath + "/json/home.json");
    Data = JSON.parse(jsonstr);
    document.getElementById('start-page-input').value = Data.url;
  } catch (e) {

  }
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

ipcRenderer.on('action-set-cache-size', (event, arg) => {
  document.getElementById('cache-size-label').innerHTML = "Cache size: " + bytesToSize(arg.cacheSize);
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

  var borderRadius = loadBorderRadius();
  applyBorderRadius(borderRadius);
  var radios = document.getElementsByName("border-radius");
  for(var i = 0; i < radios.length; i++) {
    if(radios[i].value == borderRadius) {
      radios[i].checked = true;
      break;
    }
  }
  
  loadBookmarksBar();
  loadStartPage();
  loadHomePage();
  loadSearchEngine();
  loadCache();
  loadLastTab();
  loadWelcome();
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