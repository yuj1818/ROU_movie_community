import styled from 'styled-components';

export const Button = styled.button`
  border: ${(props) => props.$border || 'none'};
  border-radius: 0.25rem;
  color: ${(props) => props.$color || 'white'};
  font-size: ${(props) => `${props.$fontSize || 0.875}rem`};
  padding-top: ${(props) =>
    props.$paddingY === 0 || props.$paddingY
      ? `${props.$paddingY}rem`
      : '0.25rem'};
  padding-bottom: ${(props) =>
    props.$paddingY === 0 || props.$paddingY
      ? `${props.$paddingY}rem`
      : '0.25rem'};
  padding-left: ${(props) =>
    props.$paddingX === 0 || props.$paddingX
      ? `${props.$paddingX}rem`
      : '0.75rem'};
  padding-right: ${(props) =>
    props.$paddingX === 0 || props.$paddingX
      ? `${props.$paddingX}rem`
      : '0.75rem'};
  white-space: nowrap;
  height: ${(props) => (props.$height ? `${props.$height}rem` : 'auto')};
  width: ${(props) =>
    props.$isFullWidth ? '100%' : props.$width ? `${props.$width}rem` : 'auto'};
  margin-top: ${(props) =>
    props.$marginTop === 0 || props.$marginTop
      ? `${props.$marginTop}rem`
      : 'auto'};
  margin-left: ${(props) =>
    props.$marginLeft === undefined ? 'auto' : `${props.$marginLeft}rem`};
  background-color: ${(props) => props.$background || 'black'};
  font-family: ${(props) => props.$fontFamily || 'Pretendard-Regular'};
  opacity: ${(props) =>
    props.$selected === undefined ? 'none' : props.$selected ? 'none' : '0.6'};

  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
    color: white;
  }
`;
