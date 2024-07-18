import Bookmark, { type IBookmark } from "../models/bookmark.model"
import { PaginationOptions, PaginatedResult } from "../utils/pagination"

export const addBookmark = async (
  bookmarkData: Partial<IBookmark>,
  userId: string,
): Promise<IBookmark> => {
  const bookmark = new Bookmark({ ...bookmarkData, user: userId })
  return await bookmark.save()
}

export const updateBookmark = async (
  id: string,
  bookmarkData: Partial<IBookmark>,
  userId: string,
): Promise<IBookmark | null> => {
  return await Bookmark.findOneAndUpdate(
    { _id: id, user: userId },
    bookmarkData,
    { new: true },
  )
}

export const deleteBookmark = async (
  id: string,
  userId: string,
): Promise<IBookmark | null> => {
  return await Bookmark.findOneAndDelete({ _id: id, user: userId })
}

export const listBookmarks = async (
  userId: string,
  options: PaginationOptions,
): Promise<PaginatedResult<IBookmark>> => {
  const total = await Bookmark.countDocuments({ user: userId })
  const bookmarks = await Bookmark.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(options.skip)
    .limit(options.limit)

  return {
    data: bookmarks,
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit),
  }
}

export const searchBookmarks = async (
  userId: string,
  searchTerm: string,
  options: PaginationOptions,
): Promise<PaginatedResult<IBookmark>> => {
  const query = {
    user: userId,
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
    ],
  }

  const total = await Bookmark.countDocuments(query)
  const bookmarks = await Bookmark.find(query)
    .sort({ createdAt: -1 })
    .skip(options.skip)
    .limit(options.limit)

  return {
    data: bookmarks,
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit),
  }
}
