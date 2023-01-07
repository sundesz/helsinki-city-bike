import { Router } from 'express';
import journeyController from '../controllers/journeyController';

const router = Router();

router.get('/', journeyController.getAll);
router.get('/:id', journeyController.get);

export default router;
