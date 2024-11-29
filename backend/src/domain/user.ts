export interface User {
    email: string;
    password: string;
  }
  
  export interface UserRepository {
    createUser(user: User): Promise<void>;
    findUserByEmail(email: string): Promise<User | null>;
  }
  