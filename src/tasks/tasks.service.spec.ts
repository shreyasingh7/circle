import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Testuser' };
const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    updateTaskStatus: jest.fn(),
});
describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });
    describe('getTasks', () => {
        it('gets all task from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('somevalue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();

             const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'some search query' };

            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('somevalue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succcessfully retrieve and return the task', async () => {
            const mockTask = { title: 'Task task', description: 'Task desc' };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
    describe('createTask', () => {
        it('create Task for a particular user', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const mockTaskDto = { title: 'Task task', description: 'Task desc' };
            const newtask = await tasksService.createTask(mockTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTaskDto, mockUser);
            expect(newtask).toEqual('someTask');
        });
    });
    describe('deleteTask', () => {
        it('calls taskRepository.delete() and delete the user task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });
        it('throw error not found task for this id to delete Task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
    describe('updateTaskStatus', () => {
        it('update task status', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);

            });
    });

});
