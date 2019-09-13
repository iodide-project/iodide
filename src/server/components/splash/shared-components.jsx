import styled from "@emotion/styled";

export const SplashTitle = styled("h1")`
  margin-top: 10px;
  margin-bottom: 40px;
  padding-bottom: 0px;
  font-size: 40px;
  width: 670px;

  sub {
    font-size: 0.6em;
    font-weight: 300;
  }
`;

export const HighlightedTitle = styled("span")`
  color: tomato;

  a {
    color: tomato;
    text-decoration: none;
  }

  a:hover {
    color: tomato;
    text-decoration: underline;
  }
`;

export const SplashCopy = styled("div")`
  margin-bottom: 60px;
  line-height: 1.5em;
`;

export const SplashContentContainer = styled("div")`
  margin: auto;
  margin-bottom: 40px;
`;

export const SingleSplash = styled("div")`
  display: flex;
  justify-content: middle;
`;
