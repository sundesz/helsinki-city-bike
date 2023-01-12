import { ErrorRequestHandler, RequestHandler } from 'express';
import { logErrorMessage } from '../utils';

export const unknownEndpoint: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Unknown Endpoint ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  let errorMessage = 'Something gone wrong';
  switch (error.name) {
    case 'SequelizeUniqueConstraintError':
      errorMessage = error.errors[0].message as string;
      break;
    case 'SequelizeValidationError':
      errorMessage = error.errors[0].message as string;
      break;
    default:
      errorMessage = error.message as string;
  }

  logErrorMessage(errorMessage);

  return res.status(400).json({ error: errorMessage });
  next(error);
};
