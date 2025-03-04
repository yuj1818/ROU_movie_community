import styled from 'styled-components';
import Colors from '../../constants/Colors';

export const CommentTextArea = styled.textarea`
  flex-grow: 1;
  border-radius: 0.25rem;
  border: 1px solid ${Colors.btnLightGray};
  resize: none;
  outline: none;
  padding: 0.5rem;
  font-size: 0.875rem;

  &::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 20px;
  }
`;
