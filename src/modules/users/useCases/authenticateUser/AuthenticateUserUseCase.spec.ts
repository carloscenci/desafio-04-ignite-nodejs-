import "reflect-metadata"
require("dotenv").config();
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    })

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            email: "test@email.com",
            name: "user",
            password: "password"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token");
        
    })


    it("Should not be able to authenticate an nonexistent user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "inexistent@email.com",
                password: "123456",
            });
        }).rejects.toBeInstanceOf(AppError);
    })

    it("should not be able to authenticate with incorrect password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "test@email.com",
                password: "1234",
                name: "user"
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "IncorrectPassword",
            });
        }).rejects.toBeInstanceOf(AppError)
    })
})