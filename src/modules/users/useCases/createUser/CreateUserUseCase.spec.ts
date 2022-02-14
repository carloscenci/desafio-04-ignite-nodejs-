import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository 


describe("Create user", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to create a user", async () => {
        const user = await createUserUseCase.execute({
            email: "user@email.com",
            name: "user",
            password: "password"
        })

        expect(user).toHaveProperty("id")
        
    })

})