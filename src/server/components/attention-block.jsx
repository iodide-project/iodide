import styled from "@emotion/styled";

const PLACEHOLDER_BACKGROUND_COLOR = "rgb(240, 240, 240)";

export default styled.div`
  align-content: center;
  align-items: center;
  border-radius: 5px;
  border: 2px dotted ${PLACEHOLDER_BACKGROUND_COLOR};
  color: gray;
  display: grid;
  font-size: 20px;
  font-weight: bold;
  grid-gap: 30px;
  justify-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
  min-height: 200px;

  background: repeating-linear-gradient(
    45deg,
    white,
    white 2px,
    ${PLACEHOLDER_BACKGROUND_COLOR} 2px,
    ${PLACEHOLDER_BACKGROUND_COLOR} 4px
  );
`;
