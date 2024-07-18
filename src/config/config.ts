export default {
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  mongoUri:
    process.env.MONGO_URI || "mongodb://localhost:27017/bookmarkmanager",
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
}
