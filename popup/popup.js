let sessionStartTime = Date.now();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const tabName = tab.dataset.tab;

      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });

  loadAdsBlocked();
  loadActivityLogs();
  loadSessionStart();
});

function loadAdsBlocked() {
  browser.browserAction.getBadgeText({}, function (result) {
    const statusElement = document.getElementById('status');
    const adsBlockedElement = document.getElementById('ads-blocked');

    if (result && result !== '') {
      statusElement.className = 'status hidden';
      adsBlockedElement.textContent = result;
    } else {
      statusElement.className = 'status inactive';
      adsBlockedElement.textContent = '0';
    }
  });
}

function loadActivityLogs() {
  browser.runtime
    .sendMessage({ type: 'getAllLogs' })
    .then((response) => {
      const messages = response.messages;
      const logsEmpty = document.getElementById('logs-empty');

      if (messages && messages.length > 0) {
        logsEmpty.style.display = 'none';
        // Sort by timestamp, newest first
        messages
          .sort((a, b) => b.timestamp - a.timestamp)
          .forEach((log) => {
            addLog(log.message, log.timestamp);
          });
      } else {
        logsEmpty.style.display = 'block';
      }
    })
    .catch((err) => {
      console.error('Error loading logs:', err);
      document.getElementById('logs-empty').style.display = 'block';
    });
}

function loadSessionStart() {
  browser.runtime
    .sendMessage({ type: 'getSessionStart' })
    .then((response) => {
      if (response && response.sessionStart) {
        sessionStartTime = response.sessionStart;
        updateSessionTime();
        setInterval(updateSessionTime, 60000);
      }
    })
    .catch((err) => {
      console.error('Error loading session start time:', err);
      updateSessionTime();
      setInterval(updateSessionTime, 60000);
    });
}

function updateSessionTime() {
  const minutes = Math.floor((Date.now() - sessionStartTime) / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let timeString;
  if (hours > 0) {
    timeString = `${hours}h ${remainingMinutes}m`;
  } else {
    timeString = `${minutes}m`;
  }

  document.getElementById('session-time').textContent = timeString;
}

function addLog(text, timestamp) {
  const ul = document.getElementById('logList');
  const li = document.createElement('li');
  li.className = 'log-item';

  const timeString = new Date(timestamp).toLocaleTimeString();

  li.innerHTML = `
        <div class="log-time">${timeString}</div>
        <div class="log-message">${text}</div>
    `;

  ul.appendChild(li);
}
