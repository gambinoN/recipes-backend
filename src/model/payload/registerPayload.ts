export class registerPayload {
    username: string
    email: string
    password: string

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public isValid(): boolean {
        return this.username !== '' && this.email !== '' && this.password !== '';
    }

    public isEmailValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
}