import User from '../../database/User/model';
import _ from 'lodash';

export const enum AccessMode {
	LOGIN = 'LOGIN',
	SIGNUP = 'SIGNUP',
}

export async function getUserData(user: User) {
	const data = _.pick(user, ['_id', 'email', 'name']);
	return data;
}
