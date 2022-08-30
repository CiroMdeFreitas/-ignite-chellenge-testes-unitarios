import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import createConnection from '../../../../database';
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { AuthenticateUserUseCase } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;
let connection: Connection;

const rightEmail = "right@email.com.br";
const rightPassword = "rightPassword";

describe("Authenticate user", () => { 
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const adminId = uuidV4()
        const adminPassword = await hash("admin", 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${adminId}',
                    'admin',
                    'admin@rentx.com,br',
                    '${adminPassword}',
                    'now()',
                    'now()')
            `);

        const userId = uuidV4()
        const userPassword = await hash(rightPassword, 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${userId}',
                    'Fulano',
                    '${rightEmail}',
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
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it("should be able to login if email and password are correct", async () => {
        const loginAttempt = await authenticateUserUseCase.execute({ email: rightEmail, password: rightPassword });
        
        expect(loginAttempt).toHaveProperty("user");
        expect(loginAttempt).toHaveProperty("token");
    });

    it("should not be able to login if email is incorrect", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({ email: "wrong@email.com", password: rightPassword });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to login if password is incorrect", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({ email: rightEmail, password: "wrongPassword" });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});