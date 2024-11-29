import {User} from '../../entities/User';

const users: User[] = [];

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return users.find(user => user.email === email) || null;
    }

    async save(user: User): Promise<void>{
        users.push(user);
    }
}
