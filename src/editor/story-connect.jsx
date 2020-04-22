import React from "react";
import { connect } from "react-redux";

const StoryPropsListCycler = (Component, storyPropsList) => {
  let i = 0;
  return () => {
    i = (i + 1) % storyPropsList.length;
    return <Component {...storyPropsList[i]} />;
  };
};

export const storyConnect = (...args) => {
  if (process.env.STORYBOOK_MODE === "true") {
    return component => {
      if (component.storyPropsList) {
        const ComponentWithProps = StoryPropsListCycler(
          component,
          component.storyPropsList
        );
        ComponentWithProps.getListOfStoryComponents = () =>
          component.storyPropsList.map(() => <ComponentWithProps />);
        return ComponentWithProps;
      }
      return component;
    };
  }
  return connect(...args);
};
