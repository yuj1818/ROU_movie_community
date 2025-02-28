import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 0.25rem;

  .active {
    border-color: ${(props) => props.$color};
    color: ${(props) => props.$color};
  }
  :disabled {
    cursor: default;
    opacity: 0.8;
    color: grey;
    background-color: lightgrey;
  }
`;
const PaginationButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  text-align: center;
  cursor: pointer;
  background-color: #ffffff;
  color: black;
  border: 1px solid #dfe3e8;
  border-radius: 4px;
  outline: none;
  font-size: 0.8rem;
`;

const Pagination = ({ currentPage, totalPages, onPageChange, color }) => {
  return (
    <Container $color={color}>
      <PaginationButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        {'<<'}
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </PaginationButton>
      {Array(5)
        .fill(undefined)
        .map(
          (_, idx) =>
            !(idx + 1 + 5 * (Math.ceil(currentPage / 5) - 1) > totalPages) && (
              <PaginationButton
                id={`${idx + 1 + 5 * (Math.ceil(currentPage / 5) - 1)}`}
                key={idx + 1 + 5 * (Math.ceil(currentPage / 5) - 1)}
                onClick={() =>
                  onPageChange(idx + 1 + 5 * (Math.ceil(currentPage / 5) - 1))
                }
                className={
                  currentPage === idx + 1 + 5 * (Math.ceil(currentPage / 5) - 1)
                    ? 'active'
                    : 'none'
                }
              >
                {idx + 1 + 5 * (Math.ceil(currentPage / 5) - 1)}
              </PaginationButton>
            ),
        )}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {'>>'}
      </PaginationButton>
    </Container>
  );
};

export default Pagination;
