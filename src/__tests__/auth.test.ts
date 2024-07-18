import request from "supertest"
import mongoose from "mongoose"
import app from ".."
import User from "../models/user.model"

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("userId")
    })

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
      })
      expect(res.statusCode).toEqual(400)
    })

    it("should return 400 if email is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "invalidemail",
        password: "password123",
      })
      expect(res.statusCode).toEqual(400)
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
    })

    it("should login a user and return a token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty("token")
    })

    it("should return 401 if credentials are invalid", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      })
      expect(res.statusCode).toEqual(401)
    })
  })
})
