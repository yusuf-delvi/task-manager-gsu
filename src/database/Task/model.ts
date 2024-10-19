import { Schema, model, Types } from 'mongoose';
import User from '../User/model';

export const DOCUMENT_NAME = 'Task';
export const COLLECTION_NAME = 'tasks';

export enum TaskStatus {
	PENDING = 'PENDING',
	INPROGRESS = 'INPROGRESS',
	DONE = 'DONE',
}

export enum TaskPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export default interface Task {
	_id: Types.ObjectId;
	title: string;
	description?: string;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate: Date;
	createdBy: User;
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
		description: {
			type: Schema.Types.String,
			default: '',
		},
		priority: {
			type: Schema.Types.String,
			required: true,
			default: TaskPriority.LOW,
			enum: Object.values(TaskPriority),
		},
		status: {
			type: Schema.Types.String,
			default: TaskStatus.PENDING,
			required: true,
			enum: Object.values(TaskStatus),
		},
		dueDate: {
			type: Schema.Types.Date,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
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
