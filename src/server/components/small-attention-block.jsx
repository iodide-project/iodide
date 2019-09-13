import styled from "@emotion/styled";

const PLACEHOLDER_BACKGROUND_COLOR = "rgb(240, 240, 240)";

export default styled("div")`
  font-size: 14px;
  text-align: center;
  color: gray;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 2px dotted ${PLACEHOLDER_BACKGROUND_COLOR};
  border-radius: 5px;
  background: repeating-linear-gradient(
    45deg,
    white,
    white 2px,
    ${PLACEHOLDER_BACKGROUND_COLOR} 2px,
    ${PLACEHOLDER_BACKGROUND_COLOR} 4px
  );

  div {
    margin-bottom: 30px;
  }
`;
