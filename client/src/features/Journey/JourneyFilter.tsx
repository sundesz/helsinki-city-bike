import { Stack } from 'react-bootstrap';

const JourneyFilter = () => {
  return (
    <div className="border rounded p-3">
      <Stack direction="horizontal" gap={3}>
        <div className="input-group mb-3">
          <span className="input-group-text">🔍</span>

          <select
            className="form-select"
            id="inputGroupSelect03"
            aria-label="Example select with button addon"
          >
            <option value="1" selected>
              Departure Station
            </option>
            <option value="2">Return Station</option>
          </select>

          <input
            type="text"
            className="form-control"
            placeholder="search ..."
          />
        </div>

        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="inputGroupSelect01">
            Order by
          </label>
          <select className="form-select" id="inputGroupSelect01">
            <option value="1">Departure Date 🔺</option>
            <option value="1">Departure Date 🔻</option>
            <option value="1">Departure Station 🔺</option>
            <option value="1">Departure Station 🔻</option>
            <option value="1">Return Date 🔺</option>
            <option value="1">Return Date 🔻</option>
            <option value="1">Return Station 🔺</option>
            <option value="1">Return Station 🔻</option>
          </select>
        </div>
      </Stack>
    </div>
  );
};

export default JourneyFilter;
