import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { Connection } from "typeorm";
import createConnection from '../../../../database';
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { StatementsRepository } from "../../../../modules/statements/repositories/StatementsRepository";

let createStamentUseCase: CreateStatementUseCase; 
let statementsRepository: IStatementsRepository; 
let usersRepository: IUsersRepository;
let connection: Connection;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

const userId = uuidV4();

describe("Create Statement Use Case", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const userPassword = await hash("password", 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${userId}',
                    'User',
                    'user@email.com',
                    '${userPassword}',
                    'now()',
                    'now()')
            `);
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });
    
    beforeEach(async () => {
        usersRepository = new UsersRepository();
        statementsRepository = new StatementsRepository();
        createStamentUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    });

    it("Should be able to make a deposit on user's account", async () => {
        const statement = await createStamentUseCase.execute({
            user_id: String(userId),
            type: "deposit" as OperationType,
            amount: 100,
            description: "description",
        })

        expect(statement).toHaveProperty("id");
        expect(statement.user_id).toBe(userId);
        expect(statement.type).toBe("deposit");
    });

    it("Should be able to make a withdraw from user's account", () => {});

    it("Should not be able to do a statement if user is invalid", () => {});

    it("Should not be able to make a withdraw from user's account if user's balance is insufficient", () => {});
});