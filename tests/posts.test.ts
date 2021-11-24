import request from "supertest";
import app from "../app";
import prisma from "../config/db";

import { clearData } from './helpers'

beforeAll(async () => await prisma.$connect());
afterAll(async () => await prisma.$disconnect());

// clean up data
beforeEach(async () => await clearData());

describe("Posts", () => {
  describe("GET /posts", () => {
    it("should return all posts", async () => {
      const postData = {
        title: "Post 01",
        content: "Hello, this a fake post",
        published: true
      };

      // create 3 posts without an auhor
      await prisma.posts.createMany({ data: [postData, postData, postData] });

      const response = await request(app).get("/feed");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
    });
  });

  describe("GET /posts/:id", () => {
    it("should return a post", async () => {
      const postData = {
        title: "Post 01",
        content: "Hello, this a fake post",
        published: true
      };

      const post = await prisma.posts.create({ data: postData });

      const response = await request(app).get(`/posts/${post.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject(postData);
    });
  });

  describe('POST /posts', () => {
    it('should create a post', async () => {
      const author = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@doe.com'
        }
      });

      const postData = {
        title: "Post 01",
        content: "Hello, this a fake post",
        authorEmail: author.email
      };

      const expectedPost = {
        content: postData.content,
        title: postData.title,
        authorId: author.id
      }

      const response = await request(app).post('/posts').send(postData);

      expect(response.body.data).toMatchObject(expectedPost);
      expect(response.status).toBe(201);
    });

    it('when I don\'t give the author email, then return an error', async () => {
      const postData = {
        title: "Post 01",
        content: "Hello, this a fake post"
      }

      const response = await request(app).post('/posts').send(postData);

      expect(response.body.code).toBe('Unprocessable Entity');
      expect(response.statusCode).toBe(422);
    })
  });
});