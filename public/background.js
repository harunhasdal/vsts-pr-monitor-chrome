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

const getFetchURL = accountName => {
  const apiVersion = `api-version=4.1`;
  const status = `searchCriteria.status=active`;
  const top = `$top=1000`;
  return `https://dev.azure.com/${accountName}/_apis/git/pullrequests?${apiVersion}&${status}&${top}`;
};

// https://docs.microsoft.com/en-us/rest/api/azure/devops/git/pull%20requests/get%20pull%20requests?view=azure-devops-rest-5.0#gitpullrequest
const fetchData = settings => {
  const url = getFetchURL(settings.accountName);
  const projectRegex = new RegExp(settings.projectRegex);
  const repoRegex = new RegExp(settings.repoRegex);

  console.log("PR Monitor fetching from ", url);
  fetch(url, {
    credentials: "include",
    redirect: "follow"
  })
    .then(r => r.json())
    .then(d => {
      if (!(d.value instanceof Array)) {
        return;
      }
      /** @type {Array.<{codeReviewId: number, createdBy: {displayName: string, imageURL: string}, creationDate: string, description: string, isDraft: boolean, mergeStatus?: string, pullRequestId: number, repository: {name: string, project: {name: string}}, reviewers: Array.<{displayName: string, imageUrl: string, vote:number}>, status: string, title: string, lastMergeCommit?: {url: string} }>} */
      const allprs = d.value;
      const prs = allprs
        .filter(pr => projectRegex.test(pr.repository.project.name))
        .filter(pr => repoRegex.test(pr.repository.name));
      chrome.storage.local.set({ pullrequests: prs }, () => {
        console.log(
          `${prs.length} out of ${
            allprs.length
          } pull requests are saved to storage`
        );
      });
      chrome.browserAction.setBadgeText({
        text: String(prs.length)
      });
    })
    .catch(e => console.log(e));

  fetch(
    `https://dev.azure.com/${
      settings.accountName
    }/_apis/git/repositories?api-version=4.1`,
    {
      credentials: "include",
      redirect: "follow"
    }
  )
    .then(r => r.json())
    .then(d => {
      if (!(d.value instanceof Array)) {
        return;
      }
      /** @type {Array.<{codeReviewId: number, createdBy: {displayName: string, imageURL: string}, creationDate: string, description: string, isDraft: boolean, mergeStatus?: string, pullRequestId: number, repository: {name: string, project: {name: string}}, reviewers: Array.<{displayName: string, imageUrl: string, vote:number}>, status: string, title: string, lastMergeCommit?: {url: string} }>} */
      const allRepos = d.value;
      chrome.storage.local.set({ repos: allRepos }, () => {
        console.log(`${allRepos.length} repos saved to storage`);
      });
    })
    .catch(e => console.log(e));
};
