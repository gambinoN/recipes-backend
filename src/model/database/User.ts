import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';
import 'reflect-metadata';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    constructor(id: number, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
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
