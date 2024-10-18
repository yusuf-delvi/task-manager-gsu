import { sign, verify } from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from './ApiError';
import { tokenInfo } from '../config';

/*
 * issuer 		— Software organization who issues the token.
 * subject 		— Intended user of the token.
 * audience 	— Basically identity of the intended recipient of the token.
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */

export class JwtPayload {
	aud: string;
	sub: string;
	iss: string;
	iat: number;
	exp: number;
	prm: string;

	constructor(
		issuer: string,
		audience: string,
		subject: string,
		param: string,
		validity: number,
	) {
		this.iss = issuer;
		this.aud = audience;
		this.sub = subject;
		this.iat = Math.floor(Date.now() / 1000);
		this.exp = this.iat + validity;
		this.prm = param;
	}
}

async function encode(payload: JwtPayload): Promise<string> {
	if (!tokenInfo.jwtSecret) throw new InternalError('Token generation failure');

	return new Promise((resolve, reject) => {
		sign(
			{ ...payload },
			tokenInfo.jwtSecret,
			{ algorithm: 'HS256' },
			(err, token) => {
				if (err || !token) {
					reject(err);
				} else {
					resolve(token);
				}
			},
		);
	});
}

/**
 * This method checks the token and returns the decoded data when token is valid in all respect
 */
async function validate(token: string): Promise<JwtPayload> {
	try {
		return new Promise((resolve, reject) => {
			verify(
				token,
				tokenInfo.jwtSecret,
				{ algorithms: ['HS256'] },
				(err, decoded) => {
					if (err) {
						reject(err);
					} else {
						resolve(decoded as unknown as JwtPayload);
					}
				},
			);
		});
	} catch (e: any) {
		if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError();
		// throws error if the token has not been encrypted by the private key
		throw new BadTokenError();
	}
}

/**
 * Returns the decoded payload if the signature is valid even if it is expired
 */
async function decode(token: string): Promise<JwtPayload> {
	try {
		return new Promise((resolve, reject) => {
			verify(
				token,
				tokenInfo.jwtSecret,
				{ algorithms: ['HS256'], ignoreExpiration: true },
				(err, decoded) => {
					if (err) {
						reject(err);
					} else {
						resolve(decoded as unknown as JwtPayload);
					}
				},
			);
		});
	} catch (e) {
		throw new BadTokenError();
	}
}

export default {
	encode,
	validate,
	decode,
};
