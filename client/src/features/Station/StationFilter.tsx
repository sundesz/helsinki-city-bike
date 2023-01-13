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

  const filterSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterColumn(() => e.target.value);
    if (filterText.trim()) {
      setPage(() => 1);
      navigate({
        pathname: '/station',
        search: `?name=${e.target.value}&value=${filterText}&orderBy=&orderDir=`,
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
      setPage(() => 1);
      navigate({
        pathname: '/station',
        search: `?&name=${filterColumn}&value=${filterText}&orderBy=&orderDir=`,
      });
      e.preventDefault();
    }
  };

  return (
    <Stack
      className="border rounded p-3 search-filter"
      direction="horizontal"
      gap={3}
    >
      <Button variant="primary" onClick={() => navigate('/journey/new')}>
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
          <option value="name_fi">Name</option>
          <option value="address_fi">Address</option>
          <option value="city_fi">City</option>
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

export default StationFilter;
