import React from "react";

import { renderValue } from "./value-renderer";

export class PromiseRep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "pending",
      value: undefined,
      runTime: 0
    };
    this.state.promise = props.promise
      .then(
        val => {
          this.setState({ status: "fulfilled", value: val });
          return val;
        },
        val => {
          this.setState({ status: "rejected", value: val });
          return val;
        }
      )
      .catch(e => {
        this.setState({ status: "rejected", value: e });
      });
    const runTimer = setInterval(() => {
      if (this.state.status === "pending") {
        this.setState({ runTime: this.state.runTime + 1 });
      } else {
        clearInterval(runTimer);
      }
    }, 1000);
  }

  render() {
    const { value, status, runTime } = this.state;
    let outputValue;
    let statusDisplay = status;
    if (status === "fulfilled" || status === "rejected") {
      outputValue = (
        <div className="promise-handler-value">{renderValue(value)}</div>
      );
    } else if (status === "pending") {
      statusDisplay = `pending (${runTime} sec)`;
    }
    return (
      <div>
        <div className="promise-handler-state">
          <div className="promise-handler-label">Promise</div>
          <div className="promise-handler-status">{statusDisplay}</div>
        </div>
        {outputValue}
      </div>
    );
  }
}

export default {
  shouldHandle: value =>
    Object.prototype.toString.call(value) === "[object Promise]",

  render: value => {
    /* because there is nothing within the Promise that we can use to check to
     see if we should update, I propose that every time we have render called here,
     we simply put in a key that forces an update. This should only happen when
     we have  return value, at any rate. */
    const promiseRep = (
      <PromiseRep promise={value} key={new Date().toString()} />
    );
    return <div>{promiseRep}</div>;
  }
};
