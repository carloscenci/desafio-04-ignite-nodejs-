import "reflect-metadata"

import { GetBalanceUseCase } from './../getBalance/GetBalanceUseCase';
import { OperationType } from './../../entities/Statement';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';


let getStatementOperationUseCase : GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase : GetBalanceUseCase;
let usersRepository : InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase( usersRepository, statementsRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
    })


    it("should be able to get a statement operation ", async () => {

        
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
        
        const { statement } = await getBalanceUseCase.execute({user_id: user.id as string});

        const response = await getStatementOperationUseCase.execute({
            statement_id: statement[0].id as string ,
            user_id: user.id as string
        });

        expect(response).toHaveProperty("id");

    });

});