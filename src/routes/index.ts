import express from 'express';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import task from './task';
import profile from './profile';

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/profile', profile);
router.use('/task', task);

export default router;
