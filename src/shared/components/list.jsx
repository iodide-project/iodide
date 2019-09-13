import styled from "@emotion/styled";

const hoverSet = color => `
  a {
    text-decoration: none;
    color: ${color};
  }

  a:hover {
    text-decoration: underline;
    color: purple;
  }
`;

const listItemAlign = pr => {
  let h = "baseline";
  switch (pr) {
    case "single": {
      h = "center";
      break;
    }
    case "double": {
      h = "flex-start";
      break;
    }
    case "triple": {
      h = "flex-start";
      break;
    }
    default: {
      h = "flex-start";
    }
  }
  return h;
};

const listItemHeight = pr => {
  let h = "32px";
  switch (pr) {
    case "single": {
      h = "32px";
      break;
    }
    case "double": {
      h = "40px";
      break;
    }
    case "triple": {
      h = "56px";
      break;
    }
    default: {
      h = "24px";
    }
  }
  return h;
};

export const LIST_BORDER = "1px solid gainsboro";
export const LIST_BORDER_RADIUS = "5px";
const PLACEHOLDER_BORDER = "1px solid transparent";

export const ListSmallLink = styled("a")`
  margin-left: 4px;
  margin-right: 4px;
  color: gray;
`;

export const ListItem = styled("div")`
  padding: 16px;
  height: ${props => listItemHeight(props.type)};
  display: flex;
  align-items: ${props => listItemAlign(props.type)};
  text-decoration: none;
  color: black;
  transition: height 200ms;

  :hover {
    background-color: #f6f8fa;
  }

  ${ListSmallLink} {
    visibility: hidden;
  }

  &:hover ${ListSmallLink} {
    visibility: visible;
  }

  ${ListSmallLink}:first-child {
    margin-left: 0;
  }
`;

export const Placeholder = styled(ListItem)`
  border-left: ${PLACEHOLDER_BORDER} !important;
  border-right: ${PLACEHOLDER_BORDER} !important;
  border-bottom: ${PLACEHOLDER_BORDER} !important;

  :hover {
    background-color: white;
  }
`;

export const List = styled("div")`
  > div {
    border-bottom: ${LIST_BORDER};
    border-left: ${LIST_BORDER};
    border-right: ${LIST_BORDER};
  }

  > div.list-placeholder {
    border-bottom: none;
  }

  > div:first-child {
    border-top: ${LIST_BORDER};
    border-top-left-radius: ${LIST_BORDER_RADIUS};
    border-top-right-radius: ${LIST_BORDER_RADIUS};
  }

  > div:last-child {
    border-bottom-left-radius: ${LIST_BORDER_RADIUS};
    border-bottom-right-radius: ${LIST_BORDER_RADIUS};
  }
`;

export const ListIcon = styled("div")``;

export const ListMain = styled("div")`
  flex-grow: 2;
  flex-basis: 500px;
  padding-right: 20px;
`;

export const ListPrimaryText = styled("div")`
  color: black;
  ${hoverSet("black")}
`;

export const ListAuthor = styled("span")`
  color: gray;
  font-size: 13px;
  padding-right: 24px;
  a {
    color: gray;
  }
`;

export const ListSecondaryTextLink = styled("a")`
  color: gray;
  text-decoration: none;

  :hover {
    text-decoration: none;
    color: purple;
  }
`;

export const ListSecondaryText = styled("div")`
  color: gray;
  font-size: 13px;
  ${hoverSet("gray")}
`;

export const ListMetadata = styled("div")``;

export const ListDate = styled("div")`
  width: 100px;
  font-size: 13px;
  color: gray;
  ${hoverSet("gray")}
`;

export const ListLinkSet = styled("div")`
  margin-left: 10px;
  margin-right: 40px;
  color: gray;
  font-size: 13px;
  ${hoverSet("gray")}
`;
