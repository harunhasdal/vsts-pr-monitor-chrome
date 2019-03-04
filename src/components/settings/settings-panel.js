import { LitElement, html, css } from "lit-element";

export class SettingsPanel extends LitElement {
  constructor() {
    super();
    this.settings = {
      accountName: "",
      projectRegex: ".*",
      repoRegex: ".*"
    };
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
    `;
  }

  render() {
    return html`
      <div class="settings-panel">
        <form>
          <div class="settings-panel-input-container">
            <label for="azure-devops-account-input">
              Azure DevOps Account:
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
            <input type="submit" @click=${this.handleSave} value="Save"></input>
          </div>
        </form>
      </div>
    `;
  }
  handleAccountChange(event) {
    this.settings.accountName = event.target.value;
  }
  handleProjectRegexChange(event) {
    this.settings.projectRegex = event.target.value;
  }
  handleRepoRegexChange(event) {
    this.settings.repoRegex = event.target.value;
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
}

customElements.define("x-settings-panel", SettingsPanel);
