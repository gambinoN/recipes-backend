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

    @Column()
    verificationToken: string;

    @Column({ default: false })
    isVerified: boolean;

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
        verificationToken: this.verificationToken,
        isVerified: this.isVerified
        };
    }
}
