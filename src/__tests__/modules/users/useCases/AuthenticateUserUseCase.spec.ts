import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { AuthenticateUserUseCase } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;
let connection: Connection;

describe("Authenticate user", () => { 
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();


        const id = uuidV4()
        const password = await hash("admin", 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${id}',
                    'admin',
                    'admin@rentx.com,br',
                    '${password}',
                    'now()',
                    'now()')
            `)
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
        const password = "123456789";
        const hashedPassword = await hash("123456789", 8)
        const registeredUser = await usersRepository.create({ name: "Fulano", email: "fulano@ignite.com.br", password: String(hashedPassword) });

        const loginAttempt = await authenticateUserUseCase.execute({ email: registeredUser.email, password: password });
        
        expect(loginAttempt).toHaveProperty("user");
        expect(loginAttempt).toHaveProperty("token");
    });

    it("should not be able to login if email is incorrect", () => {});

    it("should not be able to login if password is incorrect", () => {});
});