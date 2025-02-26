import styled from 'styled-components';
import Colors from '../../constants/Colors';

export const CheckBox = styled.label`
  box-shadow: ${(props) =>
    props.$isChecked ? 'none' : `0 0 0 1px ${Colors.btnGray}`};
  padding-top: ${(props) => `${props.$paddingY || 0.15}rem`};
  padding-bottom: ${(props) => `${props.$paddingY || 0.15}rem`};
  padding-left: ${(props) =>
    props.$paddingX === 0 || props.$paddingX
      ? `${props.$paddingX}rem`
      : '0.5rem'};
  padding-right: ${(props) =>
    props.$paddingX === 0 || props.$paddingX
      ? `${props.$paddingX}rem`
      : '0.5rem'};
  background-color: ${(props) =>
    props.$isChecked
      ? props.$isLike
        ? Colors.btnPurple
        : Colors.btnGray
      : 'white'};
  height: ${(props) => (props.$height ? `${props.$height}` : 'auto')};
  width: ${(props) => (props.$width ? `${props.$width}` : 'auto')};
  border-radius: 0.25rem;
  color: ${(props) => (props.$isChecked ? 'white' : Colors.btnGray)};
  white-space: nowrap;
  font-size: ${(props) => props.$fontSize || '0.875rem'};
  cursor: pointer;
  font-family: ${(props) => props.$fontFamily || 'Pretendard-Regular'};
`;
