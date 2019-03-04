/* eslint no-undef: 0 */
import { LitElement, html, css } from "lit-element";

import "./components/pr-item/pr-item.js";
import "./components/settings/settings-panel.js";

export class PRMonitorApp extends LitElement {
  constructor() {
    super();
    // https://docs.microsoft.com/en-us/rest/api/azure/devops/git/pull%20requests/get%20pull%20requests?view=azure-devops-rest-5.0#gitpullrequest
    /** @type {Array.<{codeReviewId: number, createdBy: {displayName: string, imageURL: string}, creationDate: string, description: string, isDraft: boolean, mergeStatus?: string, pullRequestId: number, repository: {name: string, project: {name: string}}, reviewers: Array.<{displayName: string, imageUrl: string, vote:number}>, status: string, title: string, lastMergeCommit?: {url: string} }>} */
    this.prs = [];
    this.settings = {
      accountName: "",
      projectRegex: ".*",
      repoRegex: ".*"
    };
    this.showSettings = false;

    this.toggleSettingsPanel = this.toggleSettingsPanel.bind(this);
  }

  static get styles() {
    return css`
      .App-header {
        background-color: #222;
        padding: 10px 20px;
        color: white;
        position: static;
        height: 50px;
      }
      .App-intro {
        overflow-y: auto;
        height: calc(100vh - 70px);
      }

      .App-title {
        font-size: 1.2em;
      }

      .App-title-controls {
        font-size: 0.9em;
        display: flex;
        justify-content: space-between;
      }

      .App-edit-settings-btn {
        text-decoration: underline;
        cursor: pointer;
      }

      .App-edit-settings-btn:hover {
        text-decoration: none;
      }

      .App-no-settings {
        padding: 20px;
      }
    `;
  }

  firstUpdated() {
    if (chrome && chrome.storage) {
      chrome.storage.local.get(["pullrequests", "settings"], result => {
        if (result.settings) {
          this.settings = result.settings;
        }
        if (result.pullrequests) {
          this.prs = result.pullrequests;
        }
        this.requestUpdate();
      });
      chrome.storage.onChanged.addListener(changes => {
        const prChange = changes["pullrequests"];
        if (prChange) {
          this.prs = prChange.newValue;
          this.requestUpdate();
        }
      });
    }
  }

  toggleSettingsPanel() {
    this.showSettings = !this.showSettings;
    this.requestUpdate();
  }

  onSettingsChange(event) {
    this.settings = event.detail;
    this.showSettings = event.detail.accountName === "";
    this.requestUpdate();
    if (chrome && chrome.storage) {
      chrome.storage.local.set(
        {
          settings: {
            accountName: event.detail.accountName,
            projectRegex: event.detail.projectRegex || ".*",
            repoRegex: event.detail.repoRegex || ".*"
          }
        },
        () => {
          console.log("PR Monitor settings saved");
        }
      );
    }
  }

  render() {
    const subtitle = this.showSettings
      ? `Edit settings`
      : this.settings.accountName !== ""
      ? `Currently displaying PRs in ${this.settings.accountName}`
      : `Account not set`;
    const settingsButtonLabel = this.showSettings ? `CANCEL` : `SETTINGS`;
    const settingsConfigured = this.settings.accountName !== "";
    return html`
      <div class="App">
        <header class="App-header">
          <div class="App-title">Azure DevOps Pull Requests</div>
          <div class="App-title-controls">
            <p>${subtitle}</p>
            <p>
              <a
                class="App-edit-settings-btn"
                @click=${this.toggleSettingsPanel}
              >
                ${settingsButtonLabel}
              </a>
            </p>
          </div>
        </header>
        <div class="App-intro">
          ${this.showSettings
            ? html`
                <x-settings-panel
                  .settings=${this.settings}
                  @save=${this.onSettingsChange}
                ></x-settings-panel>
              `
            : settingsConfigured
            ? this.prs.length > 0
              ? html`
                  <div class="pr-list">
                    ${this.prs.map(
                      ({
                        pullRequestId,
                        repository: {
                          name: repositoryName,
                          project: { name: projectName }
                        },
                        title,
                        createdBy: {
                          displayName: createdByName,
                          imageUrl: createdByImageUrl
                        },
                        status,
                        creationDate,
                        reviewers
                      }) => html`
                        <x-pr-item
                          .pullRequestId=${pullRequestId}
                          .repositoryName=${repositoryName}
                          .title=${title}
                          .createdBy=${createdByName}
                          .imageUrl=${createdByImageUrl}
                          .status=${status}
                          .creationDate=${creationDate}
                          .accountName=${this.settings.accountName}
                          .projectPath=${projectName}
                          .reviewers=${reviewers}
                        ></x-pr-item>
                      `
                    )}
                  </div>
                `
              : html`
                  <div class="App-no-settings">
                    <p>
                      No active PRs found.
                    </p>
                  </div>
                `
            : html`
                <div class="App-no-settings">
                  <p>
                    Please visit the settings panel to configure the pull
                    request monitor.
                  </p>
                </div>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define("x-pr-monitor-app", PRMonitorApp);
