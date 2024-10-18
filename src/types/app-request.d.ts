import { Request } from 'express';
import User from '../database/User/model';
import Keystore from '../database/Keystore/model';

declare interface PublicRequest extends Request {}

declare interface ProtectedRequest extends PublicRequest {
	user: User;
	accessToken: string;
	keystore: Keystore;
}

declare interface Tokens {
	accessToken: string;
	refreshToken: string;
}
