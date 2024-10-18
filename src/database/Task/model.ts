import { Schema, model, Types } from 'mongoose';
import User from '../User/model';

export const DOCUMENT_NAME = 'Task';
export const COLLECTION_NAME = 'tasks';

export default interface Task {
	_id: Types.ObjectId;
	title: string;
	createdBy: User;
	isCompleted: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new Schema<Task>(
	{
		title: {
			type: Schema.Types.String,
			required: true,
			maxlength: 500,
			trim: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		isCompleted: {
			type: Schema.Types.Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			required: true,
			select: false,
		},
		updatedAt: {
			type: Date,
			required: true,
			select: false,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

schema.index({ title: 'text' });

export const TaskModel = model<Task>(DOCUMENT_NAME, schema, COLLECTION_NAME);
