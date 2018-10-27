import React from "react";
import "./pr-list.css";
import { PRItem } from "../pr-item/pr-item";

export const PRList = ({ prs, subdomain }) => {
  const sortedPrs = prs.sort((a, b) => a.repository.name > b.repository.name);
  return (
    <div className="pr-list">
      {sortedPrs.map(
        ({
          pullRequestId,
          repository: {
            name: repositoryName,
            project: { name: projectName }
          },
          title,
          createdBy: { displayName: createdBy, imageUrl },
          status,
          creationDate
        }) => (
          <PRItem
            key={pullRequestId}
            pullRequestId={pullRequestId}
            repositoryName={repositoryName}
            title={title}
            createdBy={createdBy}
            imageUrl={imageUrl}
            status={status}
            creationDate={creationDate}
            subdomain={subdomain}
            projectName={projectName}
          />
        )
      )}
    </div>
  );
};
