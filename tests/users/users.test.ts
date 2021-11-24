import request from "supertest";
import app from "../../app";
import prisma from "../../config/db";
import { clearData } from "../helpers";

beforeEach(async () => await clearData());
describe("Users", () => {
  beforeAll(async () => await prisma.$connect());
  afterAll(async () => {
    await prisma.$disconnect();
    await clearData();
  });

  describe("GET /users", () => {
    test("when have no users in the list, then returns an empty array", async () => {
      const response = await request(app).get("/users");

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual([]);
    });

    test("when have users in the list, returns a list of users", async () => {
      const data = {
        name: "John Doe",
        email: "john@doe.com",
      };

      await prisma.user.create({ data });
      const response = await request(app).get("/users");

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("GET /users/:id", () => {
    test("when user is not found, returns a 404", async () => {
      const response = await request(app).get("/users/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("No User found");
    });

    test("when user is found, returns a user", async () => {
      const data = {
        name: "John Doe",
        email: "john@doe.com"
      };
      const user = await prisma.user.create({ data });

      const response = await request(app).get(`/users/${user.id}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });
  });

  describe.only("Post /users", () => {
    test("when send correct data, then create a new user", async () => {
      const data = {
        name: "John Doe",
        email: "john@example.com"
      };

      const response = await request(app)
        .post("/users")
        .send(data);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toEqual({
        id: expect.any(Number),
        name: data.name,
        email: data.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(response.statusCode).toEqual(201);
    });

    test("when the email isn't unique, then return a validation error", async () => {
      const data = {
        name: "John Doe",
        email: "john@doe.com"
      };
      await prisma.user.create({ data });

      const response = await request(app)
        .post("/users")
        .send(data);

      expect(response.body.errors).toEqual('email should be unique.');
      expect(response.statusCode).toEqual(422);
    });

    test("when the email is missing, then return a validation error", async () => {
      const errors = ['"email" is required'];
      const data = { name: "John Doe" };

      const response = await request(app)
        .post("/users")
        .send(data);

      expect(response.body.errors).toEqual(errors);
      expect(response.statusCode).toEqual(422);
    });
  });
});
