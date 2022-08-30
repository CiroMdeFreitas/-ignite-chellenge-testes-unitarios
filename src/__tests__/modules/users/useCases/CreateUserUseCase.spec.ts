import { Connection } from "typeorm";
import createConnection from '../../../../database';
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { CreateUserError } from "../../../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let connection: Connection;

describe("Create User Use Case", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
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
        const tryRegisterUser = await createUserUseCase.execute({
            name: "User",
            email: "user@email.com.br",
            password: "password"
        });

        const registeredUser = await usersRepository.findByEmail(tryRegisterUser.email);

        expect(tryRegisterUser).toEqual(registeredUser);
    });

    it("should not be able to create user if email is already in use", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "User",
                email: "user@email.com.br",
                password: "password"
            });

            await createUserUseCase.execute({
                name: "Another User",
                email: "user@email.com.br",
                password: "password"
            });
        }).rejects.toBeInstanceOf(CreateUserError);
    });
});