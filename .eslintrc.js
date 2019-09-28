module.exports = {
  settings: {
    react: {
      version: "16.3.1"
    }
  },
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    "jest/globals": true
  },
  plugins: ["jest"],
  extends: ["airbnb", "plugin:prettier/recommended", "prettier/react"],
  rules: {
    // Restricting for..of seems pretty controversial, let's disable that.
    // See https://github.com/airbnb/javascript/issues/1271
    "no-restricted-syntax": ["off"],
    // Allow i++ in the final clause of a for loop
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    // Allow JSX in .js files
    "react/jsx-filename-extension": ["off"],
    // ------------------------------------------------------------
    // TODO: The following lints are probably good to have in the long run,
    // but are disabled for now to get to zero lint
    // All component props should have PropTypes
    "react/require-default-props": ["off"],
    // a11y is hard.  We should do it, but it needs to be thought about holistically
    "jsx-a11y/no-static-element-interactions": ["off"],
    "jsx-a11y/click-events-have-key-events": ["off"],
    "jsx-a11y/anchor-has-content": ["off"],
    "jsx-a11y/anchor-is-valid": ["off"],
    // This seems to be performance-motivated
    "react/prefer-stateless-function": ["off"],
    // Only define one component per file
    "react/no-multi-comp": ["off"],
    // Don't use console.log
    "no-console": ["off"],
    // Prefer default exports
    "import/prefer-default-export": ["off"],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/__stories__/**", "**/__tests__/*", "/test/*"] }
    ]
  }
};
