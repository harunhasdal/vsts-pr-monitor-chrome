import { LitElement, html, css } from "lit-element";

const rtf = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit",
  numeric: "auto",
  style: "long"
});

const formatTimeSince = milliseconds => {
  const minutes = milliseconds / 1000 / 60;
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes.toFixed(), "minute");
  }
  const hrs = minutes / 60;
  if (Math.abs(hrs) < 24) {
    return rtf.format(hrs.toFixed(), "hour");
  }
  const days = hrs / 24;
  return rtf.format(days.toFixed(), "day");
};

export class PRItem extends LitElement {
  static get properties() {
    return {
      accountName: { type: String },
      projectPath: { type: String },
      pullRequestId: { type: String },
      repositoryName: { type: String },
      createdBy: { type: String },
      imageUrl: { type: String },
      creationDate: { type: String },
      title: { type: String },
      reviewers: { type: Array }
    };
  }

  static get styles() {
    return css`
      :host > .pr-item {
        padding: 10px;
        border-top: 1px solid gray;
        display: grid;
        grid-template-columns: 50px 1fr 66px;
        grid-gap: 5px;
      }

      :host(:first-of-type) > .pr-item {
        border-top: none;
      }

      .pr-item-link {
        text-decoration: none;
        color: black;
      }

      .pr-item-link:hover {
        cursor: pointer;
      }

      .pr-item-link:hover .pr-item-title {
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

      .avatar-container {
        margin-right: 10px;
      }

      .stats-container img {
        width: 18px;
        height: 18px;
      }

      .reviewer-container {
        position: relative;
        min-width: 25px;
      }
      .review-status {
        position: absolute;
        font-size: 8px;
        right: 0px;
        bottom: 0px;
        line-height: 8px;
        z-index: 1;
      }
    `;
  }

  render() {
    const relativeTime = formatTimeSince(
      new Date(this.creationDate) - Date.now()
    );

    const link = `https://dev.azure.com/${this.accountName}/${
      this.projectPath
    }/_git/${this.repositoryName}/pullrequest/${
      this.pullRequestId
    }?_a=overview`;
    return html`
      <div class="pr-item">
        <div class="avatar-container">
          <img .src=${this.imageUrl} />
        </div>

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
        <div class="stats-container">
          ${this.reviewers
            .filter(r => r.vote !== 0)
            .map(
              reviewer =>
                html`
                  <span
                    class="reviewer-container"
                    title="${reviewer.displayName}"
                  >
                    <img .src=${reviewer.imageUrl} />
                    <span class="review-status"
                      >${reviewer.vote > 0 ? "✅" : "⏱"}</span
                    >
                  </span>
                `
            )}
        </div>
      </div>
    `;
  }
}

customElements.define("x-pr-item", PRItem);
