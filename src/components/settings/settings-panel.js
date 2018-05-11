import React, { Component } from "react";
import "./settings-panel.css";

class SettingsPanel extends Component {
  constructor({ subdomain, projectPath, settingsUpdated }) {
    super();
    this.state = { accountName: subdomain, projectName: projectPath };
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleAccountChange(event) {
    this.setState({ accountName: event.target.value });
  }
  handleProjectChange(event) {
    this.setState({ projectName: event.target.value });
  }
  handleSave(event) {
    this.props.settingsUpdated(this.state.accountName, this.state.projectName);
  }
  render() {
    const { accountName, projectName } = this.state;
    return (
      <div className="settings-panel">
        <form>
          <div className="settings-panel-input-container">
            <label htmlFor="vsts-account-input">VSTS Account:</label>
            <input
              id="vsts-account-input"
              type="text"
              name="project"
              value={accountName}
              onChange={this.handleAccountChange}
              required
              minLength={3}
            />
            .visualstudio.com
          </div>
          <div className="settings-panel-input-container">
            <label htmlFor="vsts-project-input">VSTS Project:</label>
            <input
              id="vsts-project-input"
              type="text"
              name="project"
              value={projectName}
              onChange={this.handleProjectChange}
              required
              minLength={3}
            />
          </div>
          <div className="settings-panel-controls">
            <button onClick={this.handleSave}>Save</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SettingsPanel;
