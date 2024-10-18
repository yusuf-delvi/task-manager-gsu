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

const router = express.Router();

router.get(
	'/',
	validator(schema.pagination, ValidationSource.QUERY),
	asyncHandler(async (req, res) => {
		// const blogs = await TaskRepo.findLatestBlogs(
		// 	parseInt(req.query.pageNumber as string),
		// 	parseInt(req.query.pageItemCount as string),
		// );
		return new SuccessResponse('success', {}).send(res);
	}),
);

router.post(
	'/',
	validator(schema.create, ValidationSource.BODY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const createdTask = await TaskRepo.update({
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
			isCompleted: !foundTask.isCompleted,
		} as Task);

		if (!updatedTask) throw new BadRequestError('Unable to update');

		new SuccessResponse('Updated successfully', {}).send(res);
	}),
);

export default router;
