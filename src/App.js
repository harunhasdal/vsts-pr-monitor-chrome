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
      settings: { subdomain: "", reposRegex: ".*" },
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
      chrome.storage.onChanged.addListener(changes => {
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
  onSettingsChange(account, reposRegex) {
    const stillShowSettings = account === "" || reposRegex === "";
    this.setState(
      {
        settings: {
          subdomain: account,
          reposRegex: reposRegex
        },
        ui: { showSettings: stillShowSettings }
      },
      () => {
        if (chrome && chrome.storage) {
          chrome.storage.local.set(
            {
              settings: {
                subdomain: account,
                reposRegex: reposRegex
              }
            },
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
      settings: { subdomain, reposRegex },
      ui: { showSettings }
    } = this.state;
    const subtitle = showSettings
      ? `Edit settings`
      : subdomain !== ""
        ? `Currently displaying PRs in ${subdomain}`
        : `Account not set`;
    const settingsButtonLabel = showSettings ? `CANCEL` : `SETTINGS`;
    const settingsConfigured = subdomain !== "" && reposRegex !== "";

    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">Pull Requests</div>
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
              reposRegex={reposRegex}
              settingsUpdated={this.onSettingsChange}
            />
          ) : settingsConfigured ? (
            <PRList prs={prs} subdomain={subdomain} reposRegex={reposRegex} />
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
