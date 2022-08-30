import { v4 as uuidV4 } from "uuid";
import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

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
        const userPassword = await hash("123456789", 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${userId}',
                    'Fulano',
                    'fulano@ignite.com.br',
                    '${userPassword}',
                    'now()',
                    'now()')
            `);
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to login if email and password are correct", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: "fulano@ignite.com.br",
            password: "123456789"
        });

        expect(response.status).toBe(200);
    });

    it("should not be able to login if email is incorrect", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: "wrong@email.com.br",
            password: "123456789"
        });

        expect(response.status).toBe(401);
    });

    it("should not be able to login if password is incorrect", async () => {
        });

});