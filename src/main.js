import Prism from 'prismjs';
import Chart from 'chart.js';
import './css/style.scss';

document.getElementById('revealexpress').addEventListener('loaded', function(event) {

  Prism.highlightAll();

  const browserData = {
    chrome: { color: '#00c000', currentVersion: 77, marketShare: { worldwide: 63.72, france: 57.89 } },
    firefox: { color: '#e46e0e', currentVersion: 69, marketShare: { worldwide: 4.45, france: 9.28 }  },
    edge: { color: '#7aaffe', currentVersion: 18, marketShare: { worldwide: 2.15, france: 2.96 }  },
    ie: { color: '#2252d8', currentVersion: 11, marketShare: { worldwide: 2.23, france: 3.44 }  },
    safari: { color: '#808080', currentVersion: 13, marketShare: { worldwide: 16.34, france: 19.43 }  }
  };

  function browserStats(data, browser, faClass) {
    let li = document.createElement('li');
    let icon = document.createElement('i');
    icon.className = 'fa ' + faClass;
    icon.title = 'Current version: ' + browserData[browser].currentVersion;
    li.appendChild(icon);
    let stats = document.createElement('div');
    stats.className = 'support-ok';
    if (data instanceof Array) {
      stats.innerText = data[0].version_added === true ? 1 : data[0].version_added;
    } else if (data instanceof Object && data.version_added) {
      stats.innerText = data.version_added === true ? 1 : data.version_added;
    } else {
      stats.innerText = 'X';
      stats.className = 'support-not';
    }
    li.appendChild(stats);

    return li;
  }

  const boxes = document.querySelectorAll('.compatibility-box');
  for (let box of boxes) {
    let {category, subcategory, property} = box.dataset;

    fetch('https://raw.githubusercontent.com/mdn/browser-compat-data/master/' + category + '/' + subcategory + '/' + property + '.json')
      .then(response => response.json())
      .then(data => {
        let subcategories = subcategory.split("/");
        if (subcategories.length > 1) {
          if (subcategories[1] === "input") {
            property = "input-" + property;
          }
          data = data[category][subcategories[0]][subcategories[1]][property].__compat;
        } else {
          data = data[category][subcategory][property].__compat;
        }

        let title = document.createElement('h3');
        title.innerText = category + ' - ' + property;
        box.appendChild(title);

        let browsers = document.createElement('ul');
        browsers.className = 'browser-list';

        browsers.appendChild(browserStats(data.support.chrome, 'chrome', 'fa-chrome'));
        browsers.appendChild(browserStats(data.support.firefox, 'firefox', 'fa-firefox'));
        browsers.appendChild(browserStats(data.support.edge, 'edge', 'fa-edge'));
        browsers.appendChild(browserStats(data.support.ie, 'ie', 'fa-internet-explorer'));
        browsers.appendChild(browserStats(data.support.safari, 'safari', 'fa-safari'));

        box.appendChild(browsers);

        let mdnLink = document.createElement('a');
        mdnLink.href = data.mdn_url;
        mdnLink.target = '_blank';
        mdnLink.innerText = 'MDN';
        box.appendChild(mdnLink);
      })
    ;
  }

  Chart.defaults.global.defaultFontSize = 22;

  new Chart(document.getElementById('chart-web-browser-worldwide-usage').getContext('2d'), {
    type: 'pie',
    data: {
      labels: Object.keys(browserData).map(key => key),
      datasets: [{
        data: Object.keys(browserData).map(key => browserData[key].marketShare.worldwide),
        backgroundColor: Object.keys(browserData).map(key => browserData[key].color)
      }],
    },
    options: {
      legend: {
        position: 'left'
      }
    }
  });

  new Chart(document.getElementById('chart-web-browser-france-usage').getContext('2d'), {
    type: 'pie',
    data: {
      labels: Object.keys(browserData).map(key => key),
      datasets: [{
        data: Object.keys(browserData).map(key => browserData[key].marketShare.france),
        backgroundColor: Object.keys(browserData).map(key => browserData[key].color)
      }],
    },
    options: {
      legend: {
        position: 'left'
      }
    }
  });

});
