import { type Request, type Response } from "express"
import * as bookmarkService from "../services/bookmark.service"
import logger from "../utils/logger"
import { getPaginationOptions } from "../utils/pagination"

interface AuthRequest extends Request {
  user?: { _id: string }
}

export const addBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const bookmark = await bookmarkService.addBookmark(req.body, req.user!._id)
    res.status(201).json(bookmark)
  } catch (error) {
    logger.error("Error adding bookmark", error)
    res.status(500).json({ error: "Error adding bookmark" })
  }
}

export const updateBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const bookmark = await bookmarkService.updateBookmark(
      req.params.id,
      req.body,
      req.user!._id,
    )
    if (bookmark) {
      res.json(bookmark)
    } else {
      res.status(404).json({ error: "Bookmark not found" })
    }
  } catch (error) {
    logger.error("Error updating bookmark", error)
    res.status(500).json({ error: "Error updating bookmark" })
  }
}

export const deleteBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const bookmark = await bookmarkService.deleteBookmark(
      req.params.id,
      req.user!._id,
    )
    if (bookmark) {
      res.json({ message: "Bookmark deleted successfully" })
    } else {
      res.status(404).json({ error: "Bookmark not found" })
    }
  } catch (error) {
    logger.error("Error deleting bookmark", error)
    res.status(500).json({ error: "Error deleting bookmark" })
  }
}

export const listBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const options = getPaginationOptions(req)
    const bookmarks = await bookmarkService.listBookmarks(
      req.user!._id,
      options,
    )
    res.json(bookmarks)
  } catch (error) {
    logger.error("Error listing bookmarks", error)
    res.status(500).json({ error: "Error listing bookmarks" })
  }
}

export const searchBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const searchTerm = req.query.q as string
    const options = getPaginationOptions(req)
    const bookmarks = await bookmarkService.searchBookmarks(
      req.user!._id,
      searchTerm,
      options,
    )
    res.json(bookmarks)
  } catch (error) {
    logger.error("Error searching bookmarks", error)
    res.status(500).json({ error: "Error searching bookmarks" })
  }
}
