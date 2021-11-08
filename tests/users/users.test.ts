import request from "supertest";
import app from "../../app";
import prisma from "../../config/db";



describe("Users", () => {
  beforeAll(async () => await prisma.$connect());
  afterAll(async () => await prisma.$disconnect());

  // Clean up the user's table
  beforeEach(async () => await prisma.user.deleteMany());

  describe("GET /users", () => {
    test("when request, returns a list of users", async () => {
      const data = {
        name: "John Doe",
        email: "johasdasda@doe.com"
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
          })
        ])
      );
    });
  });
});
