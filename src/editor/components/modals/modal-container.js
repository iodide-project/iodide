import styled from "@emotion/styled";

export const ModalContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 60%;
  min-width: 700px;
  background: white;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.5);
  flex-direction: column;
  display: flex;

  @media (max-width: 1400px) {
    width: 80%;
  }
`;

export const ModalContentContainer = styled("div")`
  overflow: auto;
  padding: 20px;
  height: 100%;
`;
