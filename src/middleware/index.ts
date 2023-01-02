import { ErrorRequestHandler, RequestHandler } from 'express';

export const unknownEndpoint: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Unknown Endpoint ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  switch (error.name) {
    case 'SequelizeUniqueConstraintError':
      return res.status(400).json({ error: error.errors[0].message as string });
    case 'SequelizeValidationError':
      return res.status(400).json({ error: error.errors[0].message as string });
    default:
      return res.status(400).json({ error: error.message as string });
  }
  next(error);
};
