import styled from "@emotion/styled";

export default styled("div")`
  --gap-size: ${({ gap }) => gap || "10px"};
  --element-pad: ${({ elementPad }) => elementPad || "5px"};
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-column-gap: ${({ gap }) => gap || "10px"};
  grid-row-gap: ${({ gap }) => gap || "10px"};
  margin: auto;
  margin-bottom: ${({ bottom }) => bottom || "10px"};
  margin-top: ${({ top }) => top || "10px"};
  width: ${({ width }) => width || "auto"};
`;
