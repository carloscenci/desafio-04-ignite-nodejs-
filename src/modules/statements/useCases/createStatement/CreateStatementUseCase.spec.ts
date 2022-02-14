import "reflect-metadata"
import { OperationType } from './../../entities/Statement';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { CreateStatementError } from './CreateStatementError';


let createUserUseCase: CreateUserUseCase;
let createStatementUseCase : CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe(" Create statement", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it("should be able to create a statement", async () => {

        const user = await createUserUseCase.execute({
            name: "user",
            email: "user@email.com",
            password: "user"
        });
        
       const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            description: "description",
            amount: 10000,
            type: OperationType.DEPOSIT

        });

        expect(statement).toHaveProperty("id")
        
    })


    it("should return an error when balance < amount and type = withdraw", async () => {

        const user = await createUserUseCase.execute({
            name: "user",
            email: "user@email.com",
            password: "user"
        });

        expect(async () => {
             await createStatementUseCase.execute({
                user_id: user.id as string,
                description: "description",
                amount: 10000,
                type: OperationType.WITHDRAW

            })
        }).rejects.toBeInstanceOf(CreateStatementError)
        
        
    })
})