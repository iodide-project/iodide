export class UserRepsManager {
  constructor(warnFn) {
    this.userReps = [];
    this.warnFn = warnFn;
  }

  addRenderer(handler) {
    ["render", "shouldRender"].forEach(fncName => {
      if (!Object.keys(handler).includes(fncName)) {
        throw new Error(
          `User renderer specification missing "${fncName}" function`
        );
      }
      if (!(handler[fncName] instanceof Function)) {
        throw new Error(
          `In user renderer specification, "${fncName}" must be a function`
        );
      }
    });

    this.userReps.push(handler);
  }

  clearRenderers() {
    this.userReps = [];
  }

  getUserRepIfAvailable(value) {
    for (let i = 0; i < this.userReps.length; i++) {
      const userRep = this.userReps[i];
      let shouldRender;
      let htmlString;
      try {
        shouldRender = userRep.shouldRender(value);
      } catch (error) {
        this.warnFn("user renderer failed, `shouldRender` function errored");
      }

      if (shouldRender) {
        try {
          htmlString = userRep.render(value);
        } catch (error) {
          this.warnFn("user renderer failed, `render` function errored");
        }
      }

      if (htmlString && typeof htmlString === "string") {
        return htmlString;
      } else if (htmlString) {
        this.warnFn(
          "user renderer failed, `render` function must return string"
        );
      }
    }

    return null; // if no matches are found
  }
}

export default new UserRepsManager(console.warn);
