import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import logger from '../../utils/logger';
import Page404 from './Page404';

type IErrorPageProps = {
  error: FetchBaseQueryError | SerializedError;
};

const ErrorPage = ({ error }: IErrorPageProps) => {
  if ('data' in error && [400, 404].includes(error.status as number)) {
    return <Page404 />;
  }

  // temporary solution to display error in console
  logger.error(error);
  return null;
};

export default ErrorPage;
