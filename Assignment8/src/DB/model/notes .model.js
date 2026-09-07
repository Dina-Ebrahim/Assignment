import mongoose from "mongoose";
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "Title must not be entirely uppercase",
      },
    },
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  {
    collection: "Notes",
    timestamps: true,
    strict: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    optimisticConcurrency: true,
  },
);
export const NoteModel =
  mongoose.models.Note || mongoose.model("Note", noteSchema);
