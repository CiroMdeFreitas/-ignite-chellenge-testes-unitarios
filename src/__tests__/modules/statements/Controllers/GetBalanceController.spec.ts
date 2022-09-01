import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { Connection } from "typeorm";
import createConnection from '../../../../database';
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

const userEmail = "user@email.com";
const userPassword = "password";

describe("Show User Profile Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
        
        const userId = uuidV4();
        const hashedPassword = await hash(userPassword, 8);
        await connection.query(
            `
                INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
                values(
                    '${userId}',
                    'User',
                    '${userEmail}',
                    '${hashedPassword}',
                    'now()',
                    'now()')
            `);
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to show user's balance if user is logged", async () => {
        const login = await request(app).post("/api/v1/sessions").send({
            email: userEmail,
            password: userPassword,
        });
        const { token } = login.body;

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`,
        });

        expect(response.body).toHaveProperty("statement");
        expect(response.body).toHaveProperty("balance");
    });

    it("Should not be able to show user's balance if user is not logged", async () => {
        const login = await request(app).post("/api/v1/sessions").send({
            email: userEmail,
            password: "wrongPassword",
        });
        const { token } = login.body;

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`,
        });

        expect(response.status).toBe(401);
    });
});