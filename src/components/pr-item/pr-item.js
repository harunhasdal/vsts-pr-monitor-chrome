import React from "react";
import "./pr-item.css";
import { formatDistance } from "date-fns";

export const PRItem = props => {
  const {
    subdomain,
    projectPath,
    pullRequestId,
    repositoryName,
    createdBy,
    creationDate,
    title
  } = props;
  const relativeTime = formatDistance(creationDate, new Date());
  return (
    <div className="pr-item">
      <a
        className="pr-item-link"
        target="_blank"
        href={`https://${subdomain}.visualstudio.com/${projectPath}/_git/${repositoryName}/pullrequest/${pullRequestId}?_a=overview`}
      >
        <div className="pr-item-link-body">
          <div className="pr-item-title">
            {pullRequestId}: {title}
          </div>
          <div className="pr-item-repositoryName">{repositoryName}</div>
          <div className="pr-item-metadata">
            Created by {createdBy} {relativeTime} ago.
          </div>
        </div>
      </a>
    </div>
  );
};
