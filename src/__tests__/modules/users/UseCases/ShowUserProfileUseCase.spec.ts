import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { Connection } from "typeorm";
import createConnection from '../../../../database';
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { ShowUserProfileUseCase } from "../../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;
let connection: Connection;

const existingUserId = uuidV4()

describe("Show User Profile Use Case", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const userPassword = await hash("password", 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${existingUserId}',
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
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it("should be able to show user profile", async () => {});

    it("should not be able to show user profile if user does not exist", async () => {});
});