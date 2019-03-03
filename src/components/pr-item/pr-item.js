import { LitElement, html, css } from "lit-element";

const rtf = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit",
  numeric: "auto",
  style: "long"
});

const formatTimeSince = milliseconds => {
  const hrs = milliseconds / 1000 / 60 / 60;
  if (Math.abs(hrs) < 24) {
    return rtf.format(hrs.toFixed(), "hour");
  }
  const days = hrs / 24;
  return rtf.format(days.toFixed(), "day");
};

export class PRItem extends LitElement {
  static get properties() {
    return {
      subdomain: { type: String },
      projectPath: { type: String },
      pullRequestId: { type: String },
      repositoryName: { type: String },
      createdBy: { type: String },
      creationDate: { type: String },
      title: { type: String }
    };
  }

  static get styles() {
    return css`
      .pr-item {
        margin-bottom: 10px;
        padding: 5px;
      }

      .pr-item-link {
        text-decoration: none;
        color: black;
      }

      .pr-item-link:hover {
        text-decoration: underline;
      }

      .pr-item-repositoryName {
        font-size: 0.7rem;
      }

      .pr-item-title {
        font-size: 0.8rem;
        font-weight: 600;
        color: blue;
      }

      .pr-item-metadata {
        font-size: 0.7rem;
      }
    `;
  }

  render() {
    const relativeTime = formatTimeSince(
      new Date(this.creationDate) - Date.now()
    );

    const link = `https://dev.azure.com/${this.subdomain}/${
      this.projectPath
    }/_git/${this.repositoryName}/pullrequest/${
      this.pullRequestId
    }?_a=overview`;
    return html`
      <div class="pr-item">
        <a class="pr-item-link" target="_blank" href=${link}>
          <div class="pr-item-link-body">
            <div class="pr-item-title">
              ${this.pullRequestId}: ${this.title}
            </div>
            <div class="pr-item-repositoryName">${this.repositoryName}</div>
            <div class="pr-item-metadata">
              Created by ${this.createdBy} ${relativeTime}.
            </div>
          </div>
        </a>
      </div>
    `;
  }
}

customElements.define("x-pr-item", PRItem);
