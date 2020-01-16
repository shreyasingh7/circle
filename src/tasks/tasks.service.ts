import { Injectable, ParseUUIDPipe, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { create } from 'domain';
import { User } from 'src/auth/user.entity';
import { userInfo } from 'os';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    // getTask(filterDto: GetTasksFilterDto): Promise{
    //     const { status, search } = filterDto;

    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status = status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         );
    //     }
    //     return tasks;
    // }
    async getTaskById(id: number, user: User): Promise<Task> {

        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`Task for this Id '${id}' is not found`);
        }
        return found;
    }
    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Task for this Id '${id}' is not found`);
    //     }
    //     return found;
    // }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Task for this Id '${id}' is not found`);
        }
    }
    async updateTaskStatus(id: number, status: TaskStatus, user: User) {

        const task = await this.getTaskById(id, user);
        task.status = status;
        try {
            await task.save();
        } catch (err) {
            throw new InternalServerErrorException(err);
        }

        return task;
    }

    // updateTaskStatus(id: number, status: TaskStatus, user: User): Task {
    //     const task = this.getTaskById(id, user);
    //     task.status = status;
    //     task.userId = user;
    //     return task;
    // }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
        // const { title, description } = createTaskDto;
        // const task = new Task();
        // task.title = title;
        // task.description = description;
        // task.status = TaskStatus.OPEN;
        // task.save();

        // return task;
    }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }
}
