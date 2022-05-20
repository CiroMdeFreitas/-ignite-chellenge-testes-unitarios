import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe("Autenticate user", () => { 
    beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it("should be able to login if email and password are correct", () => {});

    it("should not be able to login if email is incorrect", () => {});

    it("should not be able to login if password is incorrect", () => {});
});