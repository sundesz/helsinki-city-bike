import { Router } from 'express';
import generalControllers from '../controllers';

const router = Router();

router.get('/upload/csv', generalControllers.uploadCSV);

export default router;
