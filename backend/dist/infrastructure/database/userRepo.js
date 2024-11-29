const mockDatabase = []; // Simulating a database
export class InMemoryUserRepo {
    async createUser(user) {
        mockDatabase.push(user);
    }
    async findUserByEmail(email) {
        return mockDatabase.find(user => user.email === email) || null;
    }
}
