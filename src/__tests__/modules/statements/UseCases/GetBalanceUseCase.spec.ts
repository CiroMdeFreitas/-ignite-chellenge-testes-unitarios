import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { Connection } from "typeorm";
import createConnection from '../../../../database';
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { GetBalanceUseCase } from "../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { StatementsRepository } from "../../../../modules/statements/repositories/StatementsRepository";

let getBalanceUseCase: GetBalanceUseCase; 
let statementsRepository: IStatementsRepository; 
let usersRepository: IUsersRepository;
let connection: Connection;

const userEmail = "user@email.com";
const userPassword = "password";

describe("Get Balance Use Case", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();


        const userId = uuidV4();
        const hashedPassword = await hash(userPassword, 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${userId}',
                    'User',
                    '${userEmail}',
                    '${hashedPassword}',
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
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    });

    it("Should be able to show user's balance", async () => ({}));
});