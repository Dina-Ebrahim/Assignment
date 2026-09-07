import mongoose from "mongoose";
import { NoteModel } from "../../DB/model/notes .model.js";
export const createNote = async (id, data) => {
  const { title, content } = data;
  const note = await NoteModel.create({ title, content, userId: id });
  return {
    message: "Note created",
  };
};
export const update = async (noteid, userId, data) => {
  const note = await NoteModel.findById(noteid);
  if (!note) {
    throw new Error("Note not found");
  }
  console.log("Note owner:", note.userId.toString());

  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner");
  }
  const update = await NoteModel.findByIdAndUpdate(noteid, data, {
    new: true,
    runValidators: true,
  });
  return {
    message: "updated",
    note: update,
  };
};
export const replace = async (noteid, userId, data) => {
  console.log("noteid:", noteid);
  console.log("userId:", userId);
  const note = await NoteModel.findById(noteid);

  if (!note) {
    throw new Error("Note not found");
  }

  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner");
  }

  const replacedNote = await NoteModel.findByIdAndUpdate(
    noteid,
    {
      title: data.title,
      content: data.content,
      userId: data.userId,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return replacedNote;
};
export const updateAll = async (userId) => {
  const result = await NoteModel.updateMany(
    { userId: userId },
    { $set: { title: "Updated Title" } },
  );
  if (result.matchedCount === 0) {
    throw new Error("No note found");
  }

  return {
    message: "All notes updated",
  };
};
export const deleteNote = async (noteId, userId) => {
  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw new Error("note not found");
  }
  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner");
  }
  const deletedNote = await NoteModel.findByIdAndDelete(noteId);
  return { message: "note deleted", note: deletedNote };
};
export const paginateSort = async (id, limit, page) => {
  const skip = (page - 1) * limit;
  const note = await NoteModel.find({ userId: id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  return note;
};

export const getById = async (noteid, userid) => {
  const note = await NoteModel.findById(noteid);
  if (!note) {
    throw new Error("note not found");
  }
  if (note.userId.toString() !== userid) {
    throw new Error("You are not the owner");
  }
  return note;
};
export const getByContent = async (userId, content) => {
  const note = await NoteModel.findOne({ userId: userId, content: content });
  if (!note) {
    throw new Error("note not found");
  }
  return note;
};
export const getNotesWithUser = async (userId) => {
  const note = await NoteModel.find({ userId })
    .select("title userId createdAt")
    .populate("userId", "email");

  return note;
};
export const aggregateNotes = async (userId, title) => {
  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (title) {
    match.title = title;
  }
  const note = await NoteModel.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "Users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        user: {
          name: "$user.name",
          email: "$user.email",
        },
      },
    },
  ]);
  return note;
};
export const deleteAllNote = async (userId) => {
  const note = await NoteModel.deleteMany({ userId: userId });
  return {
    message: "All notes deleted",
  };
};
