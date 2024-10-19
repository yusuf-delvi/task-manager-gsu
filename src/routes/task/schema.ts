import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';
import { TaskPriority, TaskStatus } from '../../database/Task/model';

export default {
	create: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().default(''),
		priority: Joi.string()
			.valid(...Object.values(TaskPriority))
			.required(),
		status: Joi.string()
			.valid(...Object.values(TaskStatus))
			.default('PENDING'),
		dueDate: Joi.date().required(),
	}),
	update: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().default(''),
		priority: Joi.string()
			.valid(...Object.values(TaskPriority))
			.required(),
		dueDate: Joi.date().required(),
	}),
	delete: Joi.object().keys({
		id: JoiObjectId().required(),
	}),
	updateStatus: Joi.object().keys({
		status: Joi.string()
			.valid(...Object.values(TaskStatus))
			.required(),
	}),
	pagination: Joi.object().keys({
		page: Joi.number().required().integer().min(1),
		limit: Joi.number().required().integer().min(1),
	}),
};
