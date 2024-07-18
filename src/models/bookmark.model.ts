import mongoose, { Document, Schema } from "mongoose"

export interface IBookmark extends Document {
  title: string
  url: string
  description?: string
  tags: string[]
  category: string
  user: mongoose.Types.ObjectId
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    tags: { type: [String] },
    category: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.model<IBookmark>("Bookmark", bookmarkSchema)
