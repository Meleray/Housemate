import styled from "styled-components";
import {v} from "./styles/variables";

export const SLayout = styled.div`
  display: flex;
`;

export const SMain = styled.main`
  padding: calc(var(--smSpacing) * 2);

  h1 {
    font-size: 14px;
  }
`;

export const SMessageMain = styled.main`
  width: 100vh;
  padding: ${v.lgSpacing};
  
  h1 {
    font-size: 14px;
  }
`;