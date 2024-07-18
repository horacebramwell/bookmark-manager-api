import express from "express"
import mongoose from "mongoose"
import bookmarkRoutes from "./routes/bookmark.route"
import authRoutes from "./routes/auth.route"
import logger from "./utils/logger"
import { errorHandler } from "./middleware/errors"
import { apiLimiter } from "./middleware/rate-limit"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Apply rate limiting to all requests
app.use(apiLimiter)

app.use("/api/auth", authRoutes)
app.use("/api/bookmarks", bookmarkRoutes)

// Error handling middleware
app.use(errorHandler)

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info("Connected to MongoDB")
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error)
    process.exit(1)
  })

export default app
