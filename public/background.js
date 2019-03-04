const prFetchAlarmName = "fetchPRs";
const settingsKey = "settings";
let settings;

chrome.storage.local.get([settingsKey], result => {
  if (!result) return;

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

// https://docs.microsoft.com/en-us/rest/api/azure/devops/git/pull%20requests/get%20pull%20requests?view=azure-devops-rest-5.0#gitpullrequest
const fetchData = settings => {
  const url = `https://dev.azure.com/${settings.accountName}/${
    settings.projectPath
  }/_apis/git/pullrequests?api-version=4.1`;
  console.log("PR Monitor fetching from ", url);
  fetch(url, {
    credentials: "include",
    redirect: "follow"
  })
    .then(r => r.json())
    .then(d => {
      /** @type {Array.<{codeReviewId: number, createdBy: {displayName: string, imageURL: string}, creationDate: string, description: string, isDraft: boolean, mergeStatus?: string, pullRequestId: number, repository: {name: string, project: {name: string}}, reviewers: Array.<{displayName: string, imageUrl: string, vote:number}>, status: string, title: string, lastMergeCommit?: {url: string} }>} */
      const prs = d.value;
      chrome.storage.local.set({ pullrequests: prs }, () => {
        console.log("Pull requests saved to storage");
      });
      chrome.browserAction.setBadgeText({
        text: String(prs.length)
      });
    })
    .catch(e => console.log(e));
};
