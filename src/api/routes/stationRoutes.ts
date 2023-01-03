import { Router } from 'express';
import stationController from '../controllers/stationController';

const router = Router();

router.get('/', stationController.getAll);
router.get('/:id', stationController.get);

export default router;
