let messages = [];
let sessionStart = null;

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'log') {
    messages.push({
      message: msg.message,
      timestamp: msg.timestamp,
    });
  } else if (msg?.type === 'getAllLogs') {
    sendResponse({ messages });
    return true;
  } else if (msg?.type === 'updateCounter') {
    browser.browserAction.setBadgeText({ text: msg.message.toString() });
  } else if (msg?.type === 'setSessionStart') {
    sessionStart = msg.sessionStart;
    messages = [];
  } else if (msg?.type === 'getSessionStart') {
    sendResponse({ sessionStart });
  }
});

// rewrite CSP to allow our script (unsafe af and allows like everything but idc)
browser.webRequest.onHeadersReceived.addListener(
  function (details) {
    for (let header of details.responseHeaders) {
      if (header.name.toLowerCase() === 'content-security-policy') {
        header.value = "default-src * data: blob: 'unsafe-inline' 'unsafe-eval';";
      }
    }

    return { responseHeaders: details.responseHeaders };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'responseHeaders']
);
