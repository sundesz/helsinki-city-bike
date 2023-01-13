import { apiSlice } from '../../app/api/apiSlice';
import { IGetAllRequestQuery, IListResponse } from '../../types';
import {
  IBaseStation,
  IStation,
  IStationResponse,
  NewStationRequestQueryType,
} from '../../types/station';

export const stationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * get station list (id and name_fi)
     */
    getStationList: builder.query<IBaseStation[], void>({
      query: () => ({
        url: 'station/list',
      }),
      providesTags: ['StationList'],
    }),

    /**
     * get all station data
     */
    getStations: builder.query<IListResponse<IStation>, IGetAllRequestQuery>({
      query: ({ page, orderBy, orderDir, filterName, filterValue }) => ({
        url: `station?page=${page}&orderBy=${orderBy}&orderDir=${orderDir}&name=${filterName}&value=${filterValue}`,
      }),
      providesTags: ['Station'],
    }),

    /**
     * get single station data
     */
    getSingleStation: builder.query<{ data: IStation }, string>({
      query: (stationId) => ({
        url: `station/${stationId}`,
      }),
    }),

    /**
     * create station data
     */
    createStation: builder.mutation<
      IStationResponse,
      NewStationRequestQueryType
    >({
      query: ({
        nameFi,
        addressFi,
        cityFi,
        operator,
        capacity,
        posX,
        posY,
      }) => ({
        url: 'station',
        method: 'POST',
        body: {
          nameFi,
          addressFi,
          cityFi,
          operator,
          capacity,
          posX,
          posY,
        },
      }),
      invalidatesTags: ['Station'],
    }),
  }),
});

export const {
  useGetStationListQuery,
  useGetStationsQuery,
  useGetSingleStationQuery,
  useCreateStationMutation,
} = stationApiSlice;
