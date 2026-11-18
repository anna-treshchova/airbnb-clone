import express from 'express';

import { validateRequest } from '#shared/validation/index.js';
import { requireAuth } from './auth.middleware.js';
import { validateEmail, validateEmailAndCode } from './auth.validator.js';
import { sendCode, verifyCode, logout } from './auth.controller.js';

const router = express.Router();

router.post('/send-code', validateRequest(validateEmail), sendCode);

router.post('/verify-code', validateRequest(validateEmailAndCode), verifyCode);

router.post('/logout', requireAuth, logout);

export default router;