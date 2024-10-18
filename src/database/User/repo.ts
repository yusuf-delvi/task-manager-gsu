import User, { UserModel } from '../User/model';
import { Types } from 'mongoose';
import KeystoreRepo from '../Keystore/repo';
import Keystore from '../Keystore/model';

async function exists(id: Types.ObjectId): Promise<boolean> {
	const user = await UserModel.exists({ _id: id });
	return user !== null && user !== undefined;
}

async function findPrivateProfileById(
	id: Types.ObjectId,
): Promise<User | null> {
	return UserModel.findOne({ _id: id }).select('+email').lean<User>().exec();
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
	return UserModel.findOne({ _id: id })
		.select('+email +password')
		.lean()
		.exec();
}

async function findByEmail(email: string): Promise<User | null> {
	return UserModel.findOne({ email: email })
		.select('+email +password')
		.lean()
		.exec();
}

async function findFieldsById(
	id: Types.ObjectId,
	...fields: string[]
): Promise<User | null> {
	return UserModel.findOne({ _id: id }, [...fields])
		.lean()
		.exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
	return UserModel.findOne({ _id: id }).lean().exec();
}

async function create(
	user: User,
	accessTokenKey: string,
	refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
	const now = new Date();

	user.createdAt = user.updatedAt = now;
	const createdUser = await UserModel.create(user);
	const keystore = await KeystoreRepo.create(
		createdUser,
		accessTokenKey,
		refreshTokenKey,
	);
	return {
		user: { ...createdUser.toObject() },
		keystore: keystore,
	};
}

async function update(
	user: User,
	accessTokenKey: string,
	refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
	user.updatedAt = new Date();
	await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
		.lean()
		.exec();
	const keystore = await KeystoreRepo.create(
		user,
		accessTokenKey,
		refreshTokenKey,
	);
	return { user: user, keystore: keystore };
}

async function updateInfo(user: User): Promise<any> {
	user.updatedAt = new Date();
	return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
		.lean()
		.exec();
}

export default {
	exists,
	findPrivateProfileById,
	findById,
	findByEmail,
	findFieldsById,
	findPublicProfileById,
	create,
	update,
	updateInfo,
};
