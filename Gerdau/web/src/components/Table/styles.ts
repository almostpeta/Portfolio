import styled from "styled-components";

const PaginationButton = styled.button`
  font-weight: 600;
  width: 35px;
  height: 30px;
  border-radius: 5px;
  color: #01516a;
  background-color: white;
  border: 1px solid #dee2e6;
  margin-right: 5px;
  &.disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const TableStyles = styled.div`
  padding: 1rem;
  width: 100%;
  .table > :not(:last-child) > :last-child > * {
    border-bottom-color: none;
  }
  table {
    border-spacing: 0;
    border: none;
    thead {
      background-color: #01516a;
      color: white;
      tr {
        :nth-child(2) {
          display: none;
        }
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }
    }
    th,
    td {
      border-left: none;
      border-right: none;
      margin: 0;
      padding: 0.5rem;
      input {
        border: none;
        height: 100%;
        width: 100%;
        border-radius: 2px;
      }
      :last-child {
        border-right: 0;
      }
    }
  }
`;

export { TableStyles, PaginationButton };
