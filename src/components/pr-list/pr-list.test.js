import React from "react";
import { shallow } from "enzyme";
import { PRList } from "./pr-list";
import { PRItem } from "../pr-item/pr-item";

it("renders PR list", () => {
  const testPrs = [
    {
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
          "https://dev.azure.com/testOrg/_api/_common/identityImage?id=f50c1460-aff7-46d7-a6d5-64f0a778e865"
      },
      creationDate: "2018-05-11T10:41:42.535574Z",
      title: "Test Title 1"
    },
    {
      repository: {
        name: "testRepo2.git",
        project: {
          name: "testProject"
        }
      },
      pullRequestId: 222,
      status: "active",
      createdBy: {
        displayName: "Kevin Garnett",
        imageUrl:
          "https://dev.azure.com/testOrg/_api/_common/identityImage?id=aa8ecfd8-e920-6c0e-ae07-46f9f3170bce"
      },
      creationDate: "2018-05-10T14:30:42.3139207Z",
      title: "Test title 2"
    }
  ];
  const wrapper = shallow(
    <PRList prs={testPrs} subdomain={"testOrg"} projectPath={"testProject"} />
  );
  expect(wrapper.find(".pr-list").exists()).toBe(true);
  const renderedPRItems = wrapper.find(PRItem);
  expect(renderedPRItems.length).toBe(2);
  const firstPRItem = renderedPRItems.get(0);
  const secondPRItem = renderedPRItems.get(1);
  expect(firstPRItem.props.pullRequestId).toBe(111);
  expect(firstPRItem.props.repositoryName).toBe("testRepo1.git");
  expect(firstPRItem.props.subdomain).toBe("testOrg");
  expect(firstPRItem.props.projectPath).toBe("testProject");
  expect(secondPRItem.props.pullRequestId).toBe(222);
  expect(secondPRItem.props.repositoryName).toBe("testRepo2.git");
  expect(secondPRItem.props.subdomain).toBe("testOrg");
  expect(secondPRItem.props.projectPath).toBe("testProject");
});
