import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import Page404 from './Page404';

type IErrorPageProps = {
  error: FetchBaseQueryError | SerializedError;
};

const ErrorPage = ({ error }: IErrorPageProps) => {
  if ('data' in error && error.status === 404) {
    return <Page404 />;
  }

  // temporary solution to display error
  return <div>{error.toString()}</div>;
};

export default ErrorPage;
