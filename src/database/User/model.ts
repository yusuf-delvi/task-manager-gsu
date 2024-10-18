import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
	_id: Types.ObjectId;
	name: string;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new Schema<User>(
	{
		name: {
			type: Schema.Types.String,
			trim: true,
			maxlength: 200,
		},
		email: {
			type: Schema.Types.String,
			unique: true,
			sparse: true, // allows null
			trim: true,
			select: false,
		},
		password: {
			type: Schema.Types.String,
			select: false,
		},
		createdAt: {
			type: Schema.Types.Date,
			required: true,
			select: false,
		},
		updatedAt: {
			type: Schema.Types.Date,
			required: true,
			select: false,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

schema.index({ email: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
