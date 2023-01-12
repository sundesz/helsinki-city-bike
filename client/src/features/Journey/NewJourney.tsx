import { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ErrorPage from '../../components/Layout/ErrorPage';
import Loading from '../../components/Layout/Loading';
import { JourneyType } from '../../types';
import { IJourneyDetail } from '../../types/journey';
import { getDateInSecond } from '../../utils';
import { useGetStationListQuery } from '../Station/stationApiSlice';
import { useCreateJourneyMutation } from './journeyApiSlice';

const journeyInit: IJourneyDetail = {
  stationId: '',
  dateTime: new Date().toISOString().substring(0, 16),
};

const NewJourney = () => {
  const [createJourney] = useCreateJourneyMutation();
  const { data: station, isError, isLoading, error } = useGetStationListQuery();
  const [departureDetail, setDepartureDetail] =
    useState<IJourneyDetail>(journeyInit);
  const [returnDetail, setReturnDetail] = useState<IJourneyDetail>(journeyInit);
  const [distance, setDistance] = useState<number>(0);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  if (!station) {
    return <div>No station data </div>;
  }

  const selectStation = () => {
    return station.map((s) => (
      <option key={s.stationId} value={s.stationId}>
        {s.nameFi}
      </option>
    ));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Departure station and return station should be different
    if (departureDetail.stationId === returnDetail.stationId) {
      toast.warning('Departure and return station should be different');
      return;
    }

    // return date should be after the departure date
    if (
      getDateInSecond(departureDetail.dateTime) >=
      getDateInSecond(returnDetail.dateTime)
    ) {
      toast.warning('Return date should be after departure');
      return;
    }

    // distanceCovered should be greater than 0
    if (distance <= 0) {
      toast.warning('Return date should be after departure');
      return;
    }

    try {
      const newJourney = await createJourney({
        departureDetail,
        returnDetail,
        distanceCovered: distance,
      });

      if ('data' in newJourney) {
        toast.success('Journey created successfully');
        setDepartureDetail(() => ({
          ...journeyInit,
          stationId: station[0].stationId.toString(),
        }));
        setReturnDetail(() => ({
          ...journeyInit,
          stationId: station[0].stationId.toString(),
        }));
        setDistance(() => 0);
      }

      if ('error' in newJourney) {
        console.log(newJourney.error);
        toast.error('Journey cannot be created.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // const stationDetail = (prevValue: IJourneyDetail): IJourneyDetail => {
  //   const stationId = prevValue.stationId
  //     ? prevValue.stationId
  //     : station[0].stationId.toString();
  //   return {
  //     stationId: stationIdCheck ? e.target.value : stationId,
  //     dateTime: dateTimeCheck ? e.target.value : prevValue.dateTime,
  //   };
  // };

  const stationHandler = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    journeyType: JourneyType
  ) => {
    const stationType = e.target.name.split('_')[1];
    const stationIdCheck = stationType === 'id';
    const dateTimeCheck = stationType === 'date';

    if (journeyType === 'departure') {
      setDepartureDetail((prevValue) => ({
        stationId: stationIdCheck ? e.target.value : prevValue.stationId,
        dateTime: dateTimeCheck ? e.target.value : prevValue.dateTime,
      }));

      // Just in case, when user select the first return station where the stationId by default will be null
      setReturnDetail((prevValue) => ({
        ...prevValue,
        stationId: prevValue.stationId
          ? prevValue.stationId
          : station[0].stationId.toString(),
      }));
    }

    if (journeyType === 'return') {
      setReturnDetail((prevValue) => ({
        stationId: stationIdCheck ? e.target.value : prevValue.stationId,
        dateTime: dateTimeCheck ? e.target.value : prevValue.dateTime,
      }));

      // Just in case, when user select the first departure station where the stationId by default will be null
      setDepartureDetail((prevValue) => ({
        ...prevValue,
        stationId: prevValue.stationId
          ? prevValue.stationId
          : station[0].stationId.toString(),
      }));
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Departure station
        </Form.Label>
        <Col sm="8">
          <Form.Select
            name="departure_id"
            value={departureDetail.stationId}
            onChange={(e) => stationHandler(e, 'departure')}
          >
            {selectStation()}
          </Form.Select>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Departure datetime
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="departure_date"
            type="datetime-local"
            value={departureDetail.dateTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationHandler(e, 'departure')
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Return station
        </Form.Label>
        <Col sm="8">
          <Form.Select
            name="return_id"
            defaultValue={returnDetail.dateTime}
            onChange={(e) => stationHandler(e, 'return')}
          >
            {selectStation()}
          </Form.Select>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Return datetime
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="return_date"
            type="datetime-local"
            value={returnDetail.dateTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationHandler(e, 'return')
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Distance
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="number"
            value={distance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDistance(() => Number(e.target.value))
            }
          />
        </Col>
      </Form.Group>

      <Button type="submit">Save</Button>
    </Form>
  );
};

export default NewJourney;
