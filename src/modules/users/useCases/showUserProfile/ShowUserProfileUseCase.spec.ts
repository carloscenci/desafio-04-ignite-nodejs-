import "reflect-metadata"
import { ShowUserProfileError } from './ShowUserProfileError';
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { ICreateUserDTO } from './../createUser/ICreateUserDTO';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let showUserProfileUseCase : ShowUserProfileUseCase;
let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepository)
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepository)
    })

    it("must be able to return a user", async () => {
        const data: ICreateUserDTO = {
            email: "test@email.com",
            name: "user",
            password: "password"
        }

        const created_user = await createUserUseCase.execute(data);

        const user = await showUserProfileUseCase.execute(created_user.id as string)

        expect(user).toHaveProperty("id")
    })

    it("must be able to return a error if a user does not exists", async () => {

        const created_user = {id: "incorrect"}


        expect(async () => {
            await showUserProfileUseCase.execute(created_user.id as string)
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })

})