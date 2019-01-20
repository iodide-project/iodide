import React from "react";
import PropTypes from "prop-types";

import ErrorStackParser from "error-stack-parser";
import StackFrame from "stackframe";

ErrorStackParser.parseV8OrIE = error => {
  const filtered = error.stack
    .split("\n")
    .filter(
      line => !!line.match(/^\s*at .*(\S+:\d+|\(native\))/m),
      ErrorStackParser
    );

  return filtered.map(line => {
    const tokens = line
      .replace(/^\s+/, "")
      .replace(/\(eval code/g, "(")
      .split(/\s+/)
      .slice(1);

    if (line.indexOf("(eval ") > -1) {
      const regExp = /\), (<[^>]+>:\d+:\d+)\)$/;
      const evalParts = regExp.exec(line);
      if (evalParts) {
        const evalLocationParts = ErrorStackParser.extractLocation(
          evalParts[1]
        );
        return new StackFrame({
          functionName: tokens[0],
          fileName: "cell",
          lineNumber: evalLocationParts[1],
          columnNumber: evalLocationParts[2],
          source: line,
          isEval: true
        });
      }
    }

    const locationParts = ErrorStackParser.extractLocation(tokens.pop());
    const functionName = tokens.join(" ") || undefined;
    const fileName =
      ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1
        ? undefined
        : locationParts[0];

    return new StackFrame({
      functionName,
      fileName,
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line
    });
  }, ErrorStackParser);
};

ErrorStackParser.parseFFOrSafari = error => {
  const filtered = error.stack
    .split("\n")
    .filter(
      line => !line.match(/^(eval@)?(\[native code\])?$/),
      ErrorStackParser
    );

  return filtered.map(line => {
    const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
    const matches = line.match(functionNameRegex);
    const functionName = matches && matches[1] ? matches[1] : undefined;

    if (line.indexOf(" > eval") > -1) {
      const regExp = / > (eval:\d+:\d+)$/;
      const evalParts = regExp.exec(line);
      if (evalParts) {
        const evalLocationParts = ErrorStackParser.extractLocation(
          evalParts[1]
        );
        return new StackFrame({
          functionName: functionName !== undefined ? functionName : "eval",
          fileName: "cell",
          lineNumber: evalLocationParts[1],
          columnNumber: evalLocationParts[2],
          source: line,
          isEval: true
        });
      }
    }

    if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
      // Safari eval frames only have function names and nothing else
      return new StackFrame({
        functionName: line
      });
    }

    const locationParts = ErrorStackParser.extractLocation(
      line.replace(functionNameRegex, "")
    );

    return new StackFrame({
      functionName,
      fileName: locationParts[0],
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line
    });
  }, ErrorStackParser);
};

export function trimStack(e) {
  // Handle passing in an Array of pre-parsed frames for testing
  const frames = e instanceof Array ? e : ErrorStackParser.parse(e);
  const outputFrames = [];

  for (const frame of frames) {
    if (frame.fileName !== undefined) {
      const parts = frame.fileName.split("/");
      if (parts[parts.length - 1].startsWith("iodide.eval-frame")) {
        break;
      }
    }
    outputFrames.push(frame.toString());
  }

  return `${e.name}: ${e.message}\n${outputFrames.join("\n")}`;
}

export default class ErrorRenderer extends React.Component {
  static propTypes = {
    error: PropTypes.object.isRequired
  };

  render() {
    const stack = trimStack(this.props.error);
    return (
      <div className="error-output">
        <pre>{stack}</pre>
      </div>
    );
  }
}
