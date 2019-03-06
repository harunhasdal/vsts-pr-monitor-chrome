import { LitElement, html, css } from "lit-element";

export class SettingsPanel extends LitElement {
  constructor() {
    super();
    this.settings = {
      accountName: "",
      projectRegex: ".*",
      repoRegex: ".*"
    };
    this.showMatchedRepos = false;
    this.matchedRepos = [];
  }

  firstUpdated() {
    chrome.storage.local.get(["repos"], result => {
      this.allRepos = result.repos;
      this.requestUpdate();
    });
  }

  static get properties() {
    return {
      settings: { type: Object }
    };
  }

  static get styles() {
    return css`
      .settings-panel {
        padding: 20px;
        overflow-y: auto;
      }

      .settings-panel-input-container {
        padding: 10px;
        display: flex;
        flex-direction: column;
      }

      .settings-panel-input-container > label {
        margin-bottom: 5px;
      }

      .settings-panel-controls {
        display: flex;
        flex-direction: row-reverse;
      }

      .settings-panel-controls > input {
        margin-right: 10px;
        margin-left: 10px;
      }

      textarea {
        min-height: 40px;
      }

      .matched-repos-container {
        padding: 0 10px;
      }

      .matched-repos {
        border: 1px solid gray;
        height: 200px;
        overflow: auto;
      }
    `;
  }

  render() {
    return html`
      <div class="settings-panel">
        <form>
          <div class="settings-panel-input-container">
            <label for="azure-devops-account-input">
              Azure DevOps Account (account in dev.azure.com/&gt;account&gt;/):
            </label>
            <input
              id="azure-devops-account-input"
              type="text"
              name="project"
              .value=${this.settings.accountName}
              @change=${this.handleAccountChange}
              required
              minlength="3"
            />
          </div>
          <div class="settings-panel-input-container">
            <label for="azure-devops-project-input">
              Project selector (regular expression):
            </label>
            <input
              id="azure-devops-project-input"
              type="text"
              name="projectRegex"
              .value=${this.settings.projectRegex}
              @change=${this.handleProjectRegexChange}
              minlength="2"
            />
          </div>
          <div class="settings-panel-input-container">
            <label for="azure-devops-repo-input">
              Repository Selector (regular expression):
            </label>
            <textarea
              id="azure-devops-repo-input"
              name="repoRegex"
              .value=${this.settings.repoRegex}
              @change=${this.handleRepoRegexChange}
              minlength="2"
            ></textarea>
          </div>
          <div class="settings-panel-controls">
            <input type="submit" @click=${
              this.handleSave
            } value="Save" ?disabled=${!this.settings.accountName}></input>
            <button @click=${this.testFilters} ?disabled=${!this.allRepos ||
      !this.settings.accountName}>Test Filters</button>
          </div>
        </form>
        ${
          this.showMatchedRepos
            ? html`
                <div class="matched-repos-container">
                  ${this.matchedRepos.length === 0
                    ? html`
                        No matches
                      `
                    : html`
                        <div>
                          Matched ${this.matchedRepos.length} repositories.
                        </div>
                        <ol class="matched-repos">
                          ${this.matchedRepos.map(
                            r =>
                              html`
                                <li>${r.name} in ${r.project.name}</li>
                              `
                          )}
                        </ol>
                      `}
                </div>
              `
            : html`
                <br />
              `
        }
      </div>
    `;
  }
  handleAccountChange(event) {
    this.settings.accountName = event.target.value;
    this.showMatchedRepos = false;
    this.requestUpdate();
  }
  handleProjectRegexChange(event) {
    this.settings.projectRegex = event.target.value;
    this.showMatchedRepos = false;
    this.requestUpdate();
  }
  handleRepoRegexChange(event) {
    this.settings.repoRegex = event.target.value;
    this.showMatchedRepos = false;
    this.requestUpdate();
  }

  handleSave(e) {
    e.preventDefault();
    const event = new CustomEvent("save", {
      bubbles: true,
      composed: true,
      detail: {
        accountName: this.settings.accountName,
        projectRegex: this.settings.projectRegex || ".*",
        repoRegex: this.settings.repoRegex || ".*"
      }
    });
    this.dispatchEvent(event);
  }

  testFilters(e) {
    e.preventDefault();
    if (chrome.storage) {
      chrome.storage.local.get(["repos"], result => {
        this.allRepos = result.repos;
        if (this.allRepos) {
          const projectRegex = new RegExp(this.settings.projectRegex);
          const repoRegex = new RegExp(this.settings.repoRegex);
          this.matchedRepos = this.allRepos
            .filter(r => projectRegex.test(r.project.name))
            .filter(r => repoRegex.test(r.name));
          this.showMatchedRepos = true;
          this.requestUpdate();
        }
      });
    }
  }
}

customElements.define("x-settings-panel", SettingsPanel);
