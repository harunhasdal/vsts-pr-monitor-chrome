import { LitElement, html, css } from "lit-element";

export class PRList extends LitElement {
  // constructor() {
  //   super();
  //   this.prs = [];
  //   this.subdomain = "";
  //   this.projectPath = "";
  // }

  static get properties() {
    return {
      prs: { type: Array },
      subdomain: { type: String },
      projectPath: { type: String }
    };
  }

  static get styles() {
    return css`
      .pr-list {
        padding: 20px;
        overflow-y: auto;
      }
    `;
  }

  updated(changedProperties) {
    console.log(changedProperties);
  }

  render() {
    const sortedPrs = this.prs.sort(
      (a, b) => a.repository.name > b.repository.name
    );
    return html`
      <div class="pr-list">
        ${sortedPrs.map(
          ({
            pullRequestId,
            repository: { name: repositoryName },
            title,
            createdBy: { displayName: createdBy, imageUrl },
            status,
            creationDate
          }) => html`
            <x-pr-item
              .pullRequestId=${pullRequestId}
              .repositoryName=${repositoryName}
              .title=${title}
              .createdBy=${createdBy}
              .imageUrl=${imageUrl}
              .status=${status}
              .creationDate=${creationDate}
              .subdomain=${this.subdomain}
              .projectPath=${this.projectPath}
            ></x-pr-item>
          `
        )}
      </div>
    `;
  }
}

customElements.define("x-pr-list", PRList);
