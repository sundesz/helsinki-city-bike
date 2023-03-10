import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
// import { useMemo } from 'react';

interface IMapProps {
  posX: number;
  posY: number;
}

const Map = ({ posX, posY }: IMapProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
  });
  //const center = useMemo(() => ({ lng: posX, lat: posY }), []);
  const location = { lng: posX, lat: posY };

  return (
    <div className="map">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={location}
          zoom={14}
        >
          <MarkerF position={location} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
