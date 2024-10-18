import { Types } from 'mongoose';
import Task, { TaskModel } from '../Task/model';
import User from '../User/model';

const AUTHOR_DETAIL = 'name';

async function create(task: Task): Promise<Task> {
	const now = new Date();
	task.createdAt = now;
	task.updatedAt = now;
	const createdBlog = await TaskModel.create(task);
	return createdBlog.toObject();
}

async function findById(id: Types.ObjectId): Promise<Task | null> {
	return TaskModel.findOne({ id: id }).lean();
}

async function update(task: Task): Promise<Task | null> {
	task.updatedAt = new Date();
	return TaskModel.findByIdAndUpdate(task._id, task, { new: true })
		.lean()
		.exec();
}

async function deleteById(id: Types.ObjectId): Promise<any> {
	return TaskModel.deleteOne({ _id: id });
}

async function findAllForAuthor(user: User): Promise<Task[]> {
	return TaskModel.find({ createdBy: user })
		.populate('createdBy', AUTHOR_DETAIL)
		.sort({ updatedAt: -1 })
		.lean()
		.exec();
}

async function search(query: string, limit: number): Promise<Task[]> {
	return TaskModel.find(
		{
			$text: { $search: query, $caseSensitive: false },
		},
		{
			similarity: { $meta: 'textScore' },
		},
	)
		.limit(limit)
		.sort({ similarity: { $meta: 'textScore' } })
		.lean()
		.exec();
}

async function searchLike(query: string, limit: number): Promise<Task[]> {
	return TaskModel.find({
		title: { $regex: `.*${query}.*`, $options: 'i' },
	})
		.limit(limit)
		.sort({ updatedAt: -1 })
		.lean()
		.exec();
}

export default {
	create,
	update,
	findById,
	deleteById,
	findAllForAuthor,
	search,
	searchLike,
};
