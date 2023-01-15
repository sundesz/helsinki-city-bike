import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IStationFilterProps {
  filterText: string;
  filterColumn: string;
  setFilterText: (value: React.SetStateAction<string>) => void;
  setFilterColumn: (value: React.SetStateAction<string>) => void;
  setPage: (value: React.SetStateAction<number>) => void;
}

const StationFilter = ({
  filterText,
  filterColumn,
  setFilterText,
  setFilterColumn,
  setPage,
}: IStationFilterProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filterSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterColumn(() => e.target.value);
    const searchValue = inputRef.current!.value;

    if (searchValue !== filterText) {
      setFilterText(() => searchValue);
    }

    if (filterText.trim()) {
      setPage(() => 1);
      navigate({
        pathname: '/station',
        search: `?name=${e.target.value}&value=${filterText}`,
      });
    }
  };

  const filterInputKeyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const searchValue = inputRef.current!.value;
    setFilterText(() => searchValue);

    if (e.key === 'Enter' && filterColumn) {
      setPage(() => 1);

      navigate({
        pathname: '/station',
        search: `?name=${filterColumn}&value=${searchValue}`,
      });
    }
  };

  return (
    <Stack
      className="border rounded p-3 search-filter"
      direction="horizontal"
      gap={3}
    >
      <Button
        id="createNew"
        variant="primary"
        onClick={() => navigate('/station/new')}
      >
        Create new
      </Button>

      <div className="input-group">
        <span className="input-group-text">🔍</span>

        <select
          className="form-select"
          id="filterName"
          value={filterColumn}
          onChange={filterSelectHandler}
        >
          <option value="name_fi">Name</option>
          <option value="address_fi">Address</option>
          <option value="city_fi">City</option>
        </select>

        <input
          id="filterValue"
          type="text"
          className="form-control flex-2"
          placeholder="search ..."
          defaultValue={filterText}
          ref={inputRef}
          onKeyDown={filterInputKeyDownHandler}
        />
      </div>
    </Stack>
  );
};

export default StationFilter;
