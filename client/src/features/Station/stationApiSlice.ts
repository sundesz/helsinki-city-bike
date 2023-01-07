import { apiSlice } from '../../app/api/apiSlice';
import { IListResponse } from '../../types';
import { IStation } from '../../types/station';

export const stationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStations: builder.query<IListResponse<IStation>, number | void>({
      query: (page) => ({
        url: `station?page=${page}`,
      }),
      providesTags: ['Station'],
    }),
    getSingleStation: builder.query<{ data: IStation }, string | undefined>({
      query: (stationId) => ({
        url: `station/${stationId}`,
      }),
    }),
  }),
});

export const { useGetStationsQuery, useGetSingleStationQuery } =
  stationApiSlice;
