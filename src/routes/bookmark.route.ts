import express from "express"
import * as bookmarkController from "../controllers/bookmark.controller"
import { auth } from "../middleware/auth"
import { validateRequest } from "../middleware/validate"
import {
  createBookmarkSchema,
  updateBookmarkSchema,
} from "../validators/bookmark.validator"

const router = express.Router()

router.use(auth)

router.post(
  "/",
  validateRequest(createBookmarkSchema),
  bookmarkController.addBookmark,
)
router.put(
  "/:id",
  validateRequest(updateBookmarkSchema),
  bookmarkController.updateBookmark,
)
router.delete("/:id", bookmarkController.deleteBookmark)
router.get("/", bookmarkController.listBookmarks)
router.get("/search", bookmarkController.searchBookmarks)

export default router
