import Station from './station_list';
import Journey from './journey_list';
import ImportCsv from './import_csv';

// StationList.hasMany(JourneyList, { foreignKey: 'departure_station_id' });
// StationList.hasMany(JourneyList, { foreignKey: 'return_station_id' });
// JourneyList.belongsTo(StationList, { foreignKey: 'station_id' });

export { Station, Journey, ImportCsv };
