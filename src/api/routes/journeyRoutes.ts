import { Router } from 'express';
import journeyController from '../controllers/journeyController';

const router = Router();

router.get('/', journeyController.getAll);
router.get('/one', journeyController.get);

export default router;
