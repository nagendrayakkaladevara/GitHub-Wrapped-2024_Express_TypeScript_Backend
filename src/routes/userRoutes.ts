import { Router } from 'express';
import { getData } from '../controllers/userController';

const router: Router = Router();

// GET all users
router.get('/getDetails/:username', getData);

// POST a new user
// router.post('/', createUser);

export default router;
