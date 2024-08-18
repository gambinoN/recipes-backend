export class loginPayload {
    email: string
    password: string

    constructor(email: string, password: string){
        this.email = email;
        this.password = password;
    }

    public isValid(): boolean {
        return this.email !== '' && this.password !== '';
    }

    public isEmailValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
}