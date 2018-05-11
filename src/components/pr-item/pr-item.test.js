import React from "react";
import { shallow } from "enzyme";
import { PRItem } from "./pr-item";

it("renders a link to the PR", () => {
  const testPR = {
    repository: {
      name: "testRepo1.git",
      project: {
        name: "testProject"
      }
    },
    pullRequestId: 111,
    status: "active",
    createdBy: {
      displayName: "Allen Iverson",
      imageUrl:
        "https://testOrg.visualstudio.com/_api/_common/identityImage?id=f50c1460-aff7-46d7-a6d5-64f0a778e865"
    },
    creationDate: "2018-05-11T10:41:42.535574Z",
    title: "Test Title 1"
  };
  const testProps = {
    subdomain: "testOrg",
    projectPath: "testProject",
    pullRequestId: 111,
    status: "active",
    createdBy: "Allen Iverson",
    imageUrl: "https://img.io",
    creationDate: "2018-05-11T10:41:42.535574Z",
    title: "Test Title 1"
  };
  const wrapper = shallow(<PRItem {...testProps} />);
  expect(wrapper.find(".pr-item").exists()).toBe(true);
  const linkItem = wrapper.find(".pr-item-link");
  expect(linkItem.exists()).toBe(true);
  expect(linkItem.get(0).props.href).toBe(
    `https://${testProps.subdomain}.visualstudio.com/${
      testProps.projectPath
    }/_git/${testProps.repositoryName}/pullrequest/${
      testProps.pullRequestId
    }?_a=overview`
  );
});
