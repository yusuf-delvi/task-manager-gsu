import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
	create: Joi.object().keys({
		title: Joi.string().required(),
	}),
	update: Joi.object().keys({
		title: Joi.string().required(),
	}),
	delete: Joi.object().keys({
		id: JoiObjectId().required(),
	}),
	updateStatus: Joi.object().keys({}),
	pagination: Joi.object().keys({
		page: Joi.number().required().integer().min(1),
		limit: Joi.number().required().integer().min(1),
	}),
};
