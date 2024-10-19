import express from 'express';
import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import Task from '../../database/Task/model';
import TaskRepo from '../../database/Task/repo';
import { BadRequestError } from '../../core/ApiError';
import { ProtectedRequest } from 'app-request';
import Joi from 'joi';

const router = express.Router();

router.get(
	'/',
	validator(Joi.object({}), ValidationSource.QUERY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const foundTasks = await TaskRepo.findAllForAuthor(req.user);

		if (!foundTasks) throw new BadRequestError('something went wrong');

		return new SuccessResponse('success', foundTasks).send(res);
	}),
);

router.post(
	'/',
	validator(schema.create, ValidationSource.BODY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const createdTask = await TaskRepo.create({
			...req.body,
			createdBy: req.user._id,
		});

		if (!createdTask) throw new BadRequestError('Unable to create task');

		new SuccessResponse('Successfully created', createdTask).send(res);
	}),
);

router.put(
	'/',
	validator(schema.update, ValidationSource.BODY),
	asyncHandler(async (req, res) => {
		const updatedTask = await TaskRepo.update(req.body);

		if (!updatedTask) throw new BadRequestError('Unable to update task');

		new SuccessResponse('Successfully updated', updatedTask).send(res);
	}),
);

router.delete(
	'/:id',
	validator(schema.delete, ValidationSource.PARAM),
	asyncHandler(async (req, res) => {
		const deletedTask = await TaskRepo.deleteById(
			req.params.id as unknown as Types.ObjectId,
		);

		if (!deletedTask) throw new BadRequestError('Unable to delete');

		new SuccessResponse('Deleted successfully', {}).send(res);
	}),
);

router.put(
	'/updateStatus',
	validator(schema.updateStatus, ValidationSource.BODY),
	asyncHandler(async (req, res) => {
		const taskId = req.body.id;

		const foundTask = await TaskRepo.findById(taskId);

		if (!foundTask) throw new BadRequestError('Task not found');

		const updatedTask = await TaskRepo.update({
			_id: taskId,
			status: req.body.status,
		} as Task);

		if (!updatedTask) throw new BadRequestError('Unable to update');

		new SuccessResponse('Updated successfully', {}).send(res);
	}),
);

export default router;
