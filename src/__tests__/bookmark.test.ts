import request from "supertest"
import mongoose from "mongoose"
import app from ".."
import User from "../models/user.model"
import Bookmark from "../models/bookmark.model"

describe("Bookmark Endpoints", () => {
  let token: string
  let userId: string

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string)
    const res = await request(app).post("/api/auth/register").send({
      username: "bookmarkuser",
      email: "bookmark@example.com",
      password: "password123",
    })
    userId = res.body.userId
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "bookmark@example.com",
      password: "password123",
    })
    token = loginRes.body.token
  })

  afterAll(async () => {
    await User.deleteMany({})
    await Bookmark.deleteMany({})
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await Bookmark.deleteMany({})
  })

  describe("POST /api/bookmarks", () => {
    it("should create a new bookmark", async () => {
      const res = await request(app)
        .post("/api/bookmarks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Bookmark",
          url: "https://example.com",
          description: "This is a test bookmark",
          tags: ["test", "example"],
          category: "Testing",
        })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("_id")
      expect(res.body.title).toEqual("Test Bookmark")
    })

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/bookmarks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Bookmark",
        })
      expect(res.statusCode).toEqual(400)
    })
  })

  describe("GET /api/bookmarks", () => {
    beforeEach(async () => {
      await Bookmark.create({
        title: "Test Bookmark 1",
        url: "https://example1.com",
        description: "This is test bookmark 1",
        tags: ["test", "example"],
        category: "Testing",
        user: userId,
      })
      await Bookmark.create({
        title: "Test Bookmark 2",
        url: "https://example2.com",
        description: "This is test bookmark 2",
        tags: ["test", "sample"],
        category: "Testing",
        user: userId,
      })
    })

    it("should return all bookmarks for the user", async () => {
      const res = await request(app)
        .get("/api/bookmarks")
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.length).toEqual(2)
      expect(res.body).toHaveProperty("total")
      expect(res.body).toHaveProperty("page")
      expect(res.body).toHaveProperty("limit")
    })

    it("should return bookmarks with pagination", async () => {
      const res = await request(app)
        .get("/api/bookmarks?page=1&limit=1")
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.length).toEqual(1)
      expect(res.body.page).toEqual(1)
      expect(res.body.limit).toEqual(1)
    })
  })

  describe("PUT /api/bookmarks/:id", () => {
    let bookmarkId: string

    beforeEach(async () => {
      const bookmark = await Bookmark.create({
        title: "Test Bookmark",
        url: "https://example.com",
        description: "This is a test bookmark",
        tags: ["test", "example"],
        category: "Testing",
        user: userId,
      })
      bookmarkId = bookmark._id ? bookmark._id.toString() : ""
    })

    it("should update a bookmark", async () => {
      const res = await request(app)
        .put(`/api/bookmarks/${bookmarkId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Test Bookmark",
          description: "This is an updated test bookmark",
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toEqual("Updated Test Bookmark")
      expect(res.body.description).toEqual("This is an updated test bookmark")
    })

    it("should return 404 if bookmark is not found", async () => {
      const res = await request(app)
        .put(`/api/bookmarks/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Test Bookmark",
        })
      expect(res.statusCode).toEqual(404)
    })
  })

  describe("DELETE /api/bookmarks/:id", () => {
    let bookmarkId: string

    beforeEach(async () => {
      const bookmark = await Bookmark.create({
        title: "Test Bookmark",
        url: "https://example.com",
        description: "This is a test bookmark",
        tags: ["test", "example"],
        category: "Testing",
        user: userId,
      })
      bookmarkId = bookmark._id ? bookmark._id.toString() : ""
    })

    it("should delete a bookmark", async () => {
      const res = await request(app)
        .delete(`/api/bookmarks/${bookmarkId}`)
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual("Bookmark deleted successfully")

      const deletedBookmark = await Bookmark.findById(bookmarkId)
      expect(deletedBookmark).toBeNull()
    })

    it("should return 404 if bookmark is not found", async () => {
      const res = await request(app)
        .delete(`/api/bookmarks/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(404)
    })
  })

  describe("GET /api/bookmarks/search", () => {
    beforeEach(async () => {
      await Bookmark.create({
        title: "JavaScript Tutorial",
        url: "https://javascript.info",
        description: "Learn JavaScript",
        tags: ["javascript", "programming"],
        category: "Programming",
        user: userId,
      })
      await Bookmark.create({
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/",
        description: "Official TypeScript documentation",
        tags: ["typescript", "programming"],
        category: "Programming",
        user: userId,
      })
    })

    it("should search bookmarks by title", async () => {
      const res = await request(app)
        .get("/api/bookmarks/search?q=JavaScript")
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.length).toEqual(1)
      expect(res.body.data[0].title).toEqual("JavaScript Tutorial")
    })

    it("should search bookmarks by tag", async () => {
      const res = await request(app)
        .get("/api/bookmarks/search?q=typescript")
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.length).toEqual(1)
      expect(res.body.data[0].title).toEqual("TypeScript Handbook")
    })

    it("should return empty array if no matches found", async () => {
      const res = await request(app)
        .get("/api/bookmarks/search?q=nonexistent")
        .set("Authorization", `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.length).toEqual(0)
    })
  })
})
