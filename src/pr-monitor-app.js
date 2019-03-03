/* eslint no-undef: 0 */
import { LitElement, html, css } from "lit-element";

import "./components/pr-item/pr-item.js";
import "./components/pr-list/pr-list.js";
import "./components/settings/settings-panel.js";

export class PRMonitorApp extends LitElement {
  constructor() {
    super();
    this.prs = [];
    this.accountName = "";
    this.projectName = "";
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
          this.accountName = result.settings.subdomain;
          this.projectName = result.settings.projectPath;
        }
        if (result.pullrequests) {
          this.prs = result.pullrequests;
        }
        this.requestUpdate();
      });
      chrome.storage.onChanged.addListener((changes, namespace) => {
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
    this.accountName = event.detail.accountName;
    this.projectName = event.detail.projectName;
    this.showSettings = this.accountName === "" || this.projectName === "";
    this.requestUpdate();
    if (chrome && chrome.storage) {
      chrome.storage.local.set(
        {
          settings: {
            subdomain: event.detail.accountName,
            projectPath: event.detail.projectName
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
      : this.projectName !== ""
      ? `Currently displaying PRs in ${this.projectName}`
      : `Project not set`;
    const settingsButtonLabel = this.showSettings ? `CANCEL` : `SETTINGS`;
    const settingsConfigured =
      this.accountName !== "" && this.projectName !== "";
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
                  .accountName=${this.accountName}
                  .projectName=${this.projectName}
                  @save=${this.onSettingsChange}
                ></x-settings-panel>
              `
            : settingsConfigured
            ? html`
                <x-pr-list
                  .prs=${this.prs}
                  .subdomain=${this.accountName}
                  .projectPath=${this.projectName}
                ></x-pr-list>
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
