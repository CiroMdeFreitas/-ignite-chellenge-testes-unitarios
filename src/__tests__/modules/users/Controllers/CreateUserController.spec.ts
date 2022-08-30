import { Connection } from "typeorm";
import createConnection from '../../../../database';
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create user", async () => {
        const response = await request(app).post("/api/v1/users").send({
            name: "User",
            email: "user@email.com.br",
            password: "password"
        });
        expect(response.status).toBe(201);
    });

    it("should not be able to create user if email is already in use", async () => {
        await request(app).post("/api/v1/users").send({
            name: "User",
            email: "user@email.com.br",
            password: "password"
        });

        const response = await request(app).post("/api/v1/users").send({
            name: "Another User",
            email: "user@email.com.br",
            password: "password"
        });
        expect(response.status).toBe(400);
    });
});