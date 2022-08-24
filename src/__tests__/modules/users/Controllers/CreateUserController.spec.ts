import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { Connection } from "typeorm";
import createConnection from '../../../../database';
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
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

    it("should be able to create user", async () => {
        const response = await request(app).post("/api/v1/users").send({
            name: "Fulano",
            email: "fulano@ignite.com.br",
            password: "123456789"
        });

        expect(response.status).toBe(201);
    });

    it("should not be able to create user if email is already in use", () => {});
});