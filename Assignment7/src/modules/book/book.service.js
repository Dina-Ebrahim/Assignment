import { db } from "../../DB/connection.db.js";
import { bookModel } from "../../DB/model/index.js";

export const createBook = async () => {
  await db.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 1,
          },
        },
      },
    },
  });

  return {
    message: "Books collection created successfully",
  };
};

export const createIndex = async () => {
  await bookModel.createIndex({ title: 1 });
  return {
    message: "Index created successfully",
  };
};

export const Insertbook = async (inputs) => {
  const result = await bookModel.insertOne(inputs);
  return result;
};

export const insertMany = async (inputs) => {
  const result = await bookModel.insertMany(inputs);
  return result;
};

export const updata = async (inputs) => {
  const result = await bookModel.updateOne(
    { title: inputs.title },
    {
      $set: {
        year: inputs.year,
      },
    },
  );

  if (!result.matchedCount) {
    throw new Error("Book not found", {
      cause: { status: 404 },
    });
  }

  return result;
};

export const findBook = async (inputs) => {
  const result = await bookModel.findOne({ title: inputs.title });
  if (!result) {
    throw new Error("Book not found", {
      cause: { status: 404 },
    });
  }
  return result;
};

export const findAll = async (inputs) => {
  const result = await bookModel
    .find({
      year: { $gte: Number(inputs.from), $lte: Number(inputs.to) },
    })
    .toArray();
  return result;
};

export const findBooksByGenre = async (inputs) => {
  const result = await bookModel.find({ genres: inputs }).toArray();
  return result;
};

export const skipLimit = async () => {
  const result = await bookModel
    .find()
    .sort({ year: -1 })
    .skip(2)
    .limit(3)
    .toArray();
  return result;
};

export const typeYear = async () => {
  const result = await bookModel.find({ year: { $type: 16 } }).toArray();
  return result;
};

export const excludeGenres = async () => {
  const result = await bookModel
    .find({
      genres: { $nin: ["Horror", "Science Fiction"] },
    })
    .toArray();
  return result;
};

export const deleteBook = async (year) => {
  const result = await bookModel.deleteMany({ year: { $lt: Number(year) } });
  if (!result.deletedCount) {
    throw new Error("No books found", {
      cause: { status: 404 },
    });
  }
  return result;
};
export const aggregation1 = async () => {
  const result = await bookModel
    .aggregate([
      {
        $match: { year: { $gt: 2000 } },
      },
      { $sort: { year: -1 } },
    ])
    .toArray();
  return result;
};
export const aggregation2 = async () => {
  const result = await bookModel
    .aggregate([
      {
        $match: { year: { $gt: 2000 } },
      },
      {
        $project: { _id: 0, title: 1, author: 1, year: 1 },
      },
    ])
    .toArray();
  return result;
};
export const aggregation3 = async () => {
  const result = await bookModel
    .aggregate([
      {
        $unwind: "$genres",
      },
    ])
    .toArray();
  return result;
};
export const aggregation4 = async () => {
  const result = await bookModel
    .aggregate([
      {
        $lookup: {
          from: "logs",
          let: {
            bookId: { $toString: "$_id" },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$book_id", "$$bookId"],
                },
              },
            },
          ],
          as: "logs",
        },
      },
    ])
    .toArray();

  return result;
};
//postman
//https://ebrahimd375-4267788.postman.co/workspace/Dina-Ebrahim's-Workspace~cc2a78ac-31ff-4c03-8bc6-6c20069f6df4/collection/57065343-21432c6e-5670-4df1-ae0b-96c01524feae?action=share&source=copy-link&creator=57065343
