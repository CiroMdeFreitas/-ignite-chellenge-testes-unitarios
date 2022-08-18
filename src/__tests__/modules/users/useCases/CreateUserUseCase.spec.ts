import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { CreateUserError } from "../../../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let connection: Connection;

describe("Create User", () => {
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
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to create user", async () => {
        const tryRegisterUser = await createUserUseCase.execute({ name: "Fulano", email: "fulano@ignite.com.br", password: "123456789" });

        const registeredUser = await usersRepository.findByEmail(tryRegisterUser.email);

        expect(tryRegisterUser).toEqual(registeredUser);
    });

    it("should be able to create user if email is already in use", () => {
        expect(async () => {
            await createUserUseCase.execute({ name: "Fulano", email: "fulano@ignite.com.br", password: "123456789" });
            await createUserUseCase.execute({ name: "Ciclano", email: "fulano@ignite.com.br", password: "123456789" });
        }).rejects.toBeInstanceOf(CreateUserError);
    });
});