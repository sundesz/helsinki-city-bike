import { Router } from 'express';
import stationController from '../controllers/stationController';

const router = Router();

router.get('/', stationController.getAll);
router.get('/list', stationController.getStationList);
router.get('/:id', stationController.getOne);
router.post('/', stationController.create);

export default router;
