import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IJourneyFilterProps {
  filterText: string;
  filterColumn: string;
  setFilterText: (value: React.SetStateAction<string>) => void;
  setFilterColumn: (value: React.SetStateAction<string>) => void;
  setPage: (value: React.SetStateAction<number>) => void;
}

const JourneyFilter = ({
  filterText,
  filterColumn,
  setFilterText,
  setFilterColumn,
  setPage,
}: IJourneyFilterProps) => {
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
        pathname: '/journey',
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
        pathname: '/journey',
        search: `?name=${filterColumn}&value=${searchValue}`,
      });
    }
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="border rounded p-3 search-filter"
    >
      <Button
        id="createNew"
        variant="primary"
        onClick={() => navigate('/journey/new')}
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
          <option value="departure_station_name">Departure Station</option>
          <option value="return_station_name">Return Station</option>
        </select>

        <input
          id="filterValue"
          type="text"
          className="form-control flex-2"
          placeholder="search ..."
          ref={inputRef}
          defaultValue={filterText}
          onKeyDown={filterInputKeyDownHandler}
        />
      </div>
    </Stack>
  );
};

export default JourneyFilter;
