/* eslint no-undef: 0 */
import React, { Component } from "react";
import "./App.css";
import { PRList } from "./components/pr-list/pr-list";
import SettingsPanel from "./components/settings/settings-panel";

class App extends Component {
  constructor() {
    super();
    this.state = {
      prs: [],
      settings: { subdomain: "", projectPath: "" },
      ui: { showSettings: false }
    };
    this.toggleSettingsPanel = this.toggleSettingsPanel.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
  }
  componentDidMount() {
    if (chrome && chrome.storage) {
      chrome.storage.local.get(["pullrequests", "settings"], result => {
        const settings = result.settings
          ? result.settings
          : this.state.settings;
        const prs = result.pullrequests ? result.pullrequests : this.state.prs;
        this.setState({ prs, settings });
      });
      chrome.storage.onChanged.addListener((changes, namespace) => {
        const prChange = changes["pullrequests"];
        if (prChange) {
          this.setState({ prs: prChange.newValue });
        }
      });
    }
  }
  toggleSettingsPanel() {
    this.setState({ ui: { showSettings: !this.state.ui.showSettings } });
  }
  onSettingsChange(account, project) {
    const stillShowSettings = account === "" || project === "";
    this.setState(
      {
        settings: { subdomain: account, projectPath: project },
        ui: { showSettings: stillShowSettings }
      },
      () => {
        if (chrome && chrome.storage) {
          chrome.storage.local.set(
            { settings: { subdomain: account, projectPath: project } },
            () => {
              console.log("PR Monitor settings saved");
            }
          );
        }
      }
    );
  }
  render() {
    const {
      prs,
      settings: { subdomain, projectPath },
      ui: { showSettings }
    } = this.state;
    const subtitle = showSettings
      ? `Edit settings`
      : projectPath !== ""
        ? `Currently displaying PRs in ${projectPath}`
        : `Project not set`;
    const settingsButtonLabel = showSettings ? `CANCEL` : `SETTINGS`;
    const settingsConfigured = subdomain !== "" && projectPath !== "";
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">VSTS Pull Requests</div>
          <div className="App-title-controls">
            <p>{subtitle}</p>
            <p>
              <a
                className="App-edit-settings-btn"
                onClick={this.toggleSettingsPanel}
              >
                {settingsButtonLabel}
              </a>
            </p>
          </div>
        </header>
        <div className="App-intro">
          {showSettings ? (
            <SettingsPanel
              subdomain={subdomain}
              projectPath={projectPath}
              settingsUpdated={this.onSettingsChange}
            />
          ) : settingsConfigured ? (
            <PRList prs={prs} subdomain={subdomain} projectPath={projectPath} />
          ) : (
            <div className="App-no-settings">
              <p>
                Please visit the settings panel to configure the pull request
                monitor.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
