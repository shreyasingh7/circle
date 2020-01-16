import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { async } from 'rxjs/internal/scheduler/async';

describe('User entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        bcrypt.hash = jest.fn();
    });
    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
            bcrypt.hash.mockReturnValue('testPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('13564');
            expect(bcrypt.hash).toHaveBeenCalledWith('13564', 'testSalt');
            expect(result).toEqual('testPassword');
        });
        it('returs false as password is invalid', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrongPassword');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
            expect(result).toEqual('wrongPassword');
        });
    });
});
