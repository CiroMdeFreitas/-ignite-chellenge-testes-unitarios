import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe("Create User", () => {
    beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to create user", async () => {
        const tryRegisterUser = await createUserUseCase.execute({ name: "Fulano", email: "fulano@ignite.com.br", password: "123456789" });

        const registeredUser = await usersRepository.findByEmail(tryRegisterUser.email);

        expect(tryRegisterUser).toEqual(registeredUser);
    });

    it("should be able to create user if email is already in use", async () => {

    });
});