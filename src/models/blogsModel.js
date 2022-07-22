const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const blogsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: ObjectId, required: true, ref: "Author" },
    tags: [{ type: String }],
    category: { type: String, required: true },
    subcategory: [{ type: String, required: true }],
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    deletedAt: String,
    publishAt: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model("Blogs", blogsSchema);
