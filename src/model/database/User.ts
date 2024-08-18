import bcrypt from 'bcrypt';

export class User {
    id: number;
    username: string;
    email: string;
    password: string;

    constructor(id: number, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public async comparePassword(plainTextPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, this.password);
    }

    public serialize(): Partial<User> {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
        };
    }
}
