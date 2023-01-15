import { useState } from 'react';
import { Form, Col, Row, Button, Alert } from 'react-bootstrap';
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
  dateTime: '',
  // dateTime: new Date().toISOString().substring(0, 16),
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

  if (station === undefined || station?.length < 2) {
    return (
      <Alert variant="warning">
        Please create at least two station before creating the journey.
      </Alert>
    );
  }

  const selectStation = () => {
    return station.map((s) => (
      <option key={s.stationId} value={s.stationId}>
        {s.nameFi}
      </option>
    ));
  };

  // document.title = 'New Journey';

  /**
   * New journey submit
   * @param e
   * @returns
   */
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Departure station and return station should be different
    if (departureDetail.stationId === returnDetail.stationId) {
      toast.warning('Departure and return station should be different.');
      return;
    }

    // return date should be after the departure date
    if (
      getDateInSecond(departureDetail.dateTime) >=
      getDateInSecond(returnDetail.dateTime)
    ) {
      toast.warning('Return date should be after departure.');
      return;
    }

    // distanceCovered should be greater than 0
    if (distance <= 0) {
      toast.warning('Distance covered should be greater than 0.');
      return;
    }

    try {
      const newJourney = await createJourney({
        departureDetail,
        returnDetail,
        distanceCovered: distance,
      });

      if ('data' in newJourney) {
        toast.success('Journey created successfully.');
        setDepartureDetail(() => journeyInit);
        setReturnDetail(() => journeyInit);
        setDistance(() => 0);
      }

      if ('error' in newJourney) {
        const err = newJourney.error as { data: { error: string } };
        toast.error(err.data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  /**
   * Station select handler
   * @param e
   * @param journeyType
   */
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
    }

    if (journeyType === 'return') {
      setReturnDetail((prevValue) => ({
        stationId: stationIdCheck ? e.target.value : prevValue.stationId,
        dateTime: dateTimeCheck ? e.target.value : prevValue.dateTime,
      }));
    }
  };

  return (
    <>
      <div className="page-header">Create new journey</div>

      <Form onSubmit={submitHandler}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Departure station:
          </Form.Label>
          <Col sm="8">
            <Form.Select
              id="departureId"
              name="departure_id"
              value={departureDetail.stationId}
              onChange={(e) => stationHandler(e, 'departure')}
            >
              <option value="">Select station</option>
              {selectStation()}
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Departure datetime:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              id="departureDate"
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
            Return station:
          </Form.Label>
          <Col sm="8">
            <Form.Select
              id="returnId"
              name="return_id"
              defaultValue={returnDetail.dateTime}
              onChange={(e) => stationHandler(e, 'return')}
            >
              <option value="">Select station</option>
              {selectStation()}
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Return datetime:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              id="returnDate"
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
            Distance covered:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              id="distance"
              name="distance"
              type="number"
              value={distance}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDistance(() => Number(e.target.value))
              }
            />
          </Col>
        </Form.Group>

        <Button id="save" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
};

export default NewJourney;
