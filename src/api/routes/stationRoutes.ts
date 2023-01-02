import { Router } from 'express';
import stationController from '../controllers/stationController';

const router = Router();

router.get('/', stationController.getAll);

export default router;
