import { NextFunction, RequestHandler } from 'express';
import { listAllCSVFiles } from '../../utils/csv';

/**
 * Check data directory for file to upload in database
 * @param _req
 * @param res
 * @param next
 */
const uploadCSV: RequestHandler = async (_req, res, next: NextFunction) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await listAllCSVFiles();
    }

    res.json({ message: 'File will be uploaded' });
  } catch (error: unknown) {
    next(error);
  }
};

export default { uploadCSV };
