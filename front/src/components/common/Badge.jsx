import styled from 'styled-components';
import Colors from '../../constants/Colors';

export const Badge = styled.div`
  padding-top: ${(props) => `${props.$paddingY || 0}rem`};
  padding-bottom: ${(props) => `${props.$paddingY || 0}rem`};
  padding-left: ${(props) =>
    props.$paddingX === 0 || props.$paddingX
      ? `${props.$paddingX}rem`
      : '0.5rem'};
  padding-right: ${(props) =>
    props.$paddingX === 0 || props.$paddingX
      ? `${props.$paddingX}rem`
      : '0.5rem'};
  background-color: ${(props) => props.$background || `${Colors.btnPurple}`};
  height: ${(props) => (props.$height ? `${props.$height}` : 'auto')};
  width: ${(props) => (props.$width ? `${props.$width}` : 'auto')};
  border-radius: 0.25rem;
  color: ${(props) => props.$color || 'white'};
  white-space: nowrap;
  font-size: ${(props) => `${props.$fontSize || 0.75}rem`};
  cursor: ${(props) => (props.$isPointer ? 'pointer' : 'default')};
  font-family: ${(props) => props.$fontFamily || 'Pretendard-ExtraLight'};
`;
