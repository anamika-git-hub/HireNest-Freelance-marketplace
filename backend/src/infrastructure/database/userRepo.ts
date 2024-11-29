import { User, UserRepository } from "../../domain/user";

const mockDatabase: User[] = []; // Simulating a database

export class InMemoryUserRepo implements UserRepository {
  async createUser(user: User): Promise<void> {
    mockDatabase.push(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return mockDatabase.find(user => user.email === email) || null;
  }
}
