import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

const request = require("supertest");
import { app } from "../../../../app";

let connection: Connection;
describe("Show profile Controller", () => {
  const userPassword = "123456";
  const user = {
    id: uuidV4(),
    name: "user test Profile",
    email: "testProfile@gmail.com",
    password: hash(userPassword, 8),
  };

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await connection.query(
      `INSERT INTO USERS (id, name, password, email, created_at) VALUES ('${
        user.id
      }', '${user.name}', '${await user.password}', '${user.email}' , 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show profile user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: userPassword,
    });

    const { token } = responseToken.body;

    const showProfileUser = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(showProfileUser.body).toHaveProperty("id");
  });
});
