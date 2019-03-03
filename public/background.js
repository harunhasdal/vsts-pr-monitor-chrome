const prFetchAlarmName = "fetchPRs";
const settingsKey = "settings";
let settings;

chrome.storage.local.get([settingsKey], result => {
  settings = result.settings;
  if (settings) {
    fetchData(settings);
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === prFetchAlarmName) {
    fetchData(settings);
  }
});

chrome.alarms.create(prFetchAlarmName, {
  delayInMinutes: 1,
  periodInMinutes: 1
});

chrome.storage.onChanged.addListener(changes => {
  const settingsChange = changes[settingsKey];
  if (settingsChange) {
    settings = settingsChange.newValue;
    fetchData(settings);
  }
});

const fetchData = settings => {
  const url = `https://dev.azure.com/${settings.subdomain}/${
    settings.projectPath
  }/_apis/git/pullrequests?api-version=4.1`;
  console.log("PR Monitor fetching from ", url);
  fetch(url, {
    credentials: "include",
    redirect: "follow"
  })
    .then(r => r.json())
    .then(d => {
      chrome.storage.local.set({ pullrequests: d.value }, () => {
        console.log("Pull requests saved to storage");
      });
      chrome.browserAction.setBadgeText({
        text: String(d.value.length)
      });
    })
    .catch(e => console.log(e));
};
