import React from "react";
import { shallow } from "enzyme";
import SettingsPanel from "./settings-panel";

it("renders html form", () => {
  const wrapper = shallow(<SettingsPanel />);
  expect(wrapper.find("form").exists()).toBe(true);
});
