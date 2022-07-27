/* eslint-disable sonarjs/no-nested-template-literals */
import styled, { css } from 'styled-components';

const Button = styled.button<{ active?: boolean }>`
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  border: none;
  outline: none !important;
  padding: 16px 24px;
  cursor: pointer;
  background-color: #3d82e2;
  border-radius: 10px;
  transition: background-color 0.15s ease-in-out;
  box-shadow: inset 0px -1px 0px 1px rgba(19, 33, 68, 0.08), 0px 1px 3px 0px rgba(19, 33, 68, 0.16), 0px 0px 1px 0px rgba(19, 33, 68, 0.08),
    0px 1px 1px 0px rgba(19, 33, 68, 0.1);

  &:hover {
    background-color: #2f75d6;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: #2f75d6;
    `}
`;

export default Button;
