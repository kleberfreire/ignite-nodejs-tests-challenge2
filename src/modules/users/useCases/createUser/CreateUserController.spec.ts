import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

const request = require("supertest");
import { app } from "../../../../app";

let connection: Connection;
describe("Create Category Controller", () => {
  const admin = {
    id: uuidV4(),
    name: "user test",
    email: "test@gmail.com",
    password: hash("123456", 8),
  };

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      name: "user test",
      email: "createUser@test.com",
      password: "123456",
    });

    expect(responseToken.status).toBe(201);
  });
});
