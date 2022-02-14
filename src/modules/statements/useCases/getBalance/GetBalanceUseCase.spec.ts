import "reflect-metadata"
import { GetBalanceError } from './GetBalanceError';
import { OperationType } from './../../entities/Statement';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';


let getBalanceUseCase : GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase

describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository )
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        getBalanceUseCase = new GetBalanceUseCase( inMemoryStatementsRepository, inMemoryUsersRepository );
    });


    it("should be able to get balance", async () => {

        const user = await createUserUseCase.execute({
            name: "user",
            email: "user@email.com",
            password: "user"
        });

        await createStatementUseCase.execute({
            user_id: user.id as string,
            description: "description",
            amount: 10000,
            type: OperationType.DEPOSIT

        });
        
        const response = await getBalanceUseCase.execute({user_id: user.id as string});

        expect(response.statement.length).toBe(1)
        
    })

    it("should not be able to get balance if user not exists", async () => {

        const user = await createUserUseCase.execute({
            name: "user",
            email: "user@email.com",
            password: "user"
        });

        await createStatementUseCase.execute({
            user_id: user.id as string,
            description: "description",
            amount: 10000,
            type: OperationType.DEPOSIT

        });
        
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "incorrect_id"});
        }).rejects.toBeInstanceOf(GetBalanceError)
        
    })

})