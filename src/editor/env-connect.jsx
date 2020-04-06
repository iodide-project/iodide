import React from "react";
import { connect } from "react-redux";

const StoryPropsListCycler = (WrappedComponent, storyPropsList) => {
  let i = 0;
  return () => {
    i = (i + 1) % storyPropsList.length;
    return <WrappedComponent {...storyPropsList[i]} />;
  };
};

export const envConnect = mapStateToProps => {
  if (process.env.STORYBOOK_MODE === "true") {
    return component => {
      if (component.storyPropsList) {
        return StoryPropsListCycler(component, component.storyPropsList);
      }
      return component;
    };
  }
  return connect(mapStateToProps);
};
