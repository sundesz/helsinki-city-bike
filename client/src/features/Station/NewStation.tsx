import React, { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useCreateStationMutation } from '../Station/stationApiSlice';

interface INewStation {
  nameFi: string;
  addressFi: string;
  cityFi: string;
  operator: string;
  capacity: number;
  coordinates: string;
}

const initValue: INewStation = {
  nameFi: '',
  addressFi: '',
  cityFi: '',
  operator: '',
  capacity: 0,
  coordinates: '',
};

const checkCoordinate = (coordinates: string) => {
  const position = coordinates.split(',');

  if (position.length !== 2) {
    return false;
  }

  return position.every((n: string) => Number.isFinite(Number(n)));
};

const NewStation = () => {
  const [createStation] = useCreateStationMutation();
  const [station, setStation] = useState<INewStation>(initValue);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // check all fields before creating new one
      let key: keyof typeof station;
      for (key in station) {
        if (!station[key]) {
          toast.warning('All fields are required');
          return;
        }
        if (key === 'coordinates' && !checkCoordinate(station[key])) {
          toast.warning('Invalid coordinates');
          return;
        }
      }

      const { coordinates, ...newStationData } = station;
      const position: string[] = coordinates.split(',');

      const NewStation = await createStation({
        ...newStationData,
        posX: Number(position[0]),
        posY: Number(position[1]),
      });

      if ('data' in NewStation) {
        toast.success('Station created successfully');
        setStation(() => initValue);
      }

      if ('error' in NewStation) {
        console.log(NewStation.error);
        toast.error('Station cannot be created.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const stationChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentElement = { [e.target.name]: e.target.value };
    setStation((prevValue) => ({ ...prevValue, ...currentElement }));
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Name:
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="nameFi"
            value={station.nameFi}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationChangeHandler(e)
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Address:
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="addressFi"
            value={station.addressFi}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationChangeHandler(e)
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          City:
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="cityFi"
            value={station.cityFi}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationChangeHandler(e)
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Operator:
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="operator"
            value={station.operator}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationChangeHandler(e)
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Capacity:
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="capacity"
            type="number"
            value={station.capacity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationChangeHandler(e)
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Location Coordinate(x,y):
        </Form.Label>
        <Col sm="8">
          <Form.Control
            name="coordinates"
            value={station.coordinates}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              stationChangeHandler(e)
            }
          />
        </Col>
      </Form.Group>

      <Button type="submit">Save</Button>
    </Form>
  );
};

export default NewStation;
