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

  const filterSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterColumn(() => e.target.value);

    if (filterText.trim()) {
      setPage(1);
      navigate({
        pathname: '/journey',
        search: `?name=${e.target.value}&value=${filterText}`,
      });
    }
  };

  const filterInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(() => e.target.value);
  };

  const filterInputKeyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && filterColumn) {
      setPage(1);
      navigate({
        pathname: '/journey',
        search: `?name=${filterColumn}&value=${filterText}`,
      });
    }
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="border rounded p-3 search-filter"
    >
      <Button variant="primary" onClick={() => navigate('/station/new')}>
        Create new
      </Button>
      <div className="input-group">
        <span className="input-group-text">🔍</span>

        <select
          className="form-select"
          id="inputGroupSelect03"
          // defaultValue={2}
          value={filterColumn}
          onChange={filterSelectHandler}
        >
          <option value="departure_station_name">Departure Station</option>
          <option value="return_station_name">Return Station</option>
        </select>

        <input
          type="text"
          className="form-control flex-2"
          placeholder="search ..."
          value={filterText}
          onChange={filterInputChangeHandler}
          onKeyDown={filterInputKeyDownHandler}
        />
      </div>
    </Stack>
  );
};

export default JourneyFilter;
