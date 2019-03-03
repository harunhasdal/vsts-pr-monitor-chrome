import { LitElement, html, css } from "lit-element";

export class SettingsPanel extends LitElement {
  constructor() {
    super();
    this.accountName = "";
    this.projectName = "";
  }

  static get properties() {
    return {
      accountName: { type: String },
      projectName: { type: String }
    };
  }

  static get styles() {
    return css`
      .settings-panel {
        padding: 20px;
        overflow-y: auto;
      }

      .settings-panel-input-container {
        padding: 20px;
        margin-bottom: 10px;
        display: flex;
      }

      .settings-panel-input-container > label {
        min-width: 190px;
      }

      .settings-panel-controls {
        display: flex;
        flex-direction: row-reverse;
      }

      .settings-panel-controls > button {
        min-width: 120px;
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
              .value=${this.accountName}
              @change=${this.handleAccountChange}
              required
              minlength="3"
            />
          </div>
          <div class="settings-panel-input-container">
            <label for="azure-devops-project-input">
              Azure DevOps Project:
            </label>
            <input
              id="azure-devops-project-input"
              type="text"
              name="project"
              .value=${this.projectName}
              @change=${this.handleProjectChange}
              required
              minlength="3"
            />
          </div>
          <div class="settings-panel-controls">
            <button @click=${this.handleSave}>Save</button>
          </div>
        </form>
      </div>
    `;
  }
  handleAccountChange(event) {
    this.accountName = event.target.value;
  }
  handleProjectChange(event) {
    this.projectName = event.target.value;
  }

  handleSave() {
    const event = new CustomEvent("save", {
      bubbles: true,
      composed: true,
      detail: {
        accountName: this.accountName,
        projectName: this.projectName
      }
    });
    this.dispatchEvent(event);
  }
}

customElements.define("x-settings-panel", SettingsPanel);
