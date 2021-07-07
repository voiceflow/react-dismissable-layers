import styled, { keyframes } from 'styled-components';

const fadeKeyframes = keyframes`
  from {
    transform: translate3d(0px, 8px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  background-color: #fff;
  z-index: 10000;
  animation: ${fadeKeyframes} 0.15s ease-in-out;
  animation-fill-mode: both;
`;

export default Container;
