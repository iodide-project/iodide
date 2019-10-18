import { keyframes } from "@emotion/core";

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const bounce = keyframes`
  from {
    transform: translateY(-25px);
  }
  to {
    transform: translateY(25px);
  }
`;
