import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: function () {
        return this.attachments?.length > 0 ? false : true;
      },
      minLength: 2,
      maxLength: 50000,
    },
    attachments: [String],
    senderId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: false,
      index: true,
    },
  },
  {
    collection: "messages",
    timestamps: true,
    strict: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    optimisticConcurrency: true,
    changeCredentialsTime: Date,
  },
);

export const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);
