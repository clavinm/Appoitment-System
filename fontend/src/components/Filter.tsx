/* eslint-disable react/prop-types */
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';


const StyledFilter = styled.div`
  border: 1px solid var(--color-primary-200);
  background-color: transparent;
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.1rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-primary-100);
  border: none;

  ${(props) =>
    props.active === 'true' &&
    css`
      background-color: var(--color-blue-700);
      color: var(--color-blue-100);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.2rem;
  /* To give the same height as select */
  padding: 0.4rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-blue-700);
    color: var(--color-blue-100);
  }
`;

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterValue = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    if (!value) {
      searchParams.delete(filterField);
    } else {
      searchParams.set(filterField, value);
    }

    if (searchParams.get('page')) searchParams.set('page', 1);

    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          onClick={() => handleClick(option.value)}
          active={String(filterValue === option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;
