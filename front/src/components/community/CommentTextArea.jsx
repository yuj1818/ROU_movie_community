import styled from 'styled-components';

export const CommentTextArea = styled.textarea`
  flex-grow: 1;
  border-radius: 0.25rem;
  border: 1px solid black;
  resize: none;
  outline: none;
  padding: 0.5rem;

  &::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 20px;
  }
`;
