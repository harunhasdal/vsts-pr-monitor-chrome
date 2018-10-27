const prFetchAlarmName = "fetchPRs";
const settingsKey = "settings";
let settings;

chrome.storage.local.get([settingsKey], function(result) {
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

const getURL = subdomain => {
  return `https://${subdomain}.visualstudio.com/_apis/git/pullrequests?api-version=4.1`;
};

const fetchData = settings => {
  if (!settings || !settings.subdomain) {
    return;
  }
  const url = getURL(settings.subdomain);
  const regex = settings.reposRegex
    ? new RegExp(settings.reposRegex)
    : new RegExp(".*");

  console.log("PR Monitor fetching PRs from ", url);
  fetch(url, {
    credentials: "include",
    redirect: "follow"
  })
    .then(r => r.json())
    .then(d => {
      console.log("Retreived", d.value);
      return d.value;
    })
    .then(d => d.filter(pr => regex.test(pr.repository.name)))
    .then(d => {
      chrome.storage.local.set({ pullrequests: d }, () => {
        console.log("Pull requests saved to storage");
      });
      chrome.browserAction.setBadgeText({
        text: String(d.length)
      });
    })
    .catch(e => console.log(e));
};
