import { Connection, createConnection } from "typeorm";

const request = require("supertest");
import { app } from "../../../../app";

let connection: Connection;
describe("Create user Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const userCreated = await request(app).post("/api/v1/users").send({
      name: "user test2",
      email: "createUser@test.com",
      password: "123456",
    });

    expect(userCreated.status).toBe(201);
  });
});
