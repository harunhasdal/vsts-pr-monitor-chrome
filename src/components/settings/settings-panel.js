import React, { Component } from "react";
import "./settings-panel.css";

class SettingsPanel extends Component {
  constructor({ subdomain, reposRegex }) {
    super();
    this.state = {
      accountName: subdomain,
      reposRegex: reposRegex
    };
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleReposRegexChange = this.handleReposRegexChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleAccountChange(event) {
    this.setState({ accountName: event.target.value });
  }
  handleReposRegexChange(event) {
    this.setState({ reposRegex: event.target.value });
  }
  handleSave() {
    this.props.settingsUpdated(this.state.accountName, this.state.reposRegex);
  }
  render() {
    const { accountName, reposRegex } = this.state;
    return (
      <div className="settings-panel">
        <form>
          <div className="settings-panel-input-container">
            <label htmlFor="vsts-account-input">Account:</label>
            <input
              id="vsts-account-input"
              type="text"
              name="account"
              value={accountName}
              onChange={this.handleAccountChange}
              required
              minLength={3}
            />
            .visualstudio.com
          </div>
          <div className="settings-panel-input-container">
            <label htmlFor="vsts-repos-input">Repos (regex):</label>
            <input
              id="vsts-repos-input"
              type="text"
              name="reposRegex"
              value={reposRegex}
              onChange={this.handleReposRegexChange}
              required
              minLength={2}
              placeholder="example: .*docs.*"
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
