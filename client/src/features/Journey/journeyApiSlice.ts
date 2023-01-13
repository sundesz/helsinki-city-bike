// import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

// import type { RootState } from '../../app/store';

import { apiSlice } from '../../app/api/apiSlice';
import { IListResponse } from '../../types';
import {
  IJourney,
  IJourneyResponse,
  INewJourneyRequestQuery,
} from '../../types/journey';
import { IGetAllRequestQuery } from '../../types';

export const journeyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * get a single journey data
     */
    getSingleJourney: builder.query<{ data: IJourney }, string>({
      query: (journeyId) => ({
        url: `journey/${journeyId}`,
      }),
    }),
    /**
     * get all journey data
     */
    getJourney: builder.query<IListResponse<IJourney>, IGetAllRequestQuery>({
      query: ({ page, orderBy, orderDir, filterName, filterValue }) => ({
        url: `journey?page=${page}&orderBy=${orderBy}&orderDir=${orderDir}&name=${filterName}&value=${filterValue}`,
      }),
      providesTags: ['Journey'],
    }),
    /**
     * create journey data
     */
    createJourney: builder.mutation<IJourneyResponse, INewJourneyRequestQuery>({
      query: ({ departureDetail, returnDetail, distanceCovered }) => ({
        url: 'journey',
        method: 'POST',
        body: {
          departureStationId: departureDetail.stationId,
          departureDateTime: departureDetail.dateTime,
          returnStationId: returnDetail.stationId,
          returnDateTime: returnDetail.dateTime,
          distanceCovered,
        },
      }),
      invalidatesTags: ['Journey'],
    }),
  }),
});

export const {
  useGetJourneyQuery,
  useGetSingleJourneyQuery,
  useCreateJourneyMutation,
} = journeyApiSlice;
