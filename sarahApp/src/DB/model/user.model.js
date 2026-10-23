import mongoose from "mongoose";
import { GenderEnum, RoleEnum, ProviderEnum } from "../../common/enum/index.js";
const userSchema = new mongoose.Schema(
  {
    fristName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        this.provider === ProviderEnum.GOOGLE;
      },
    },
    phone: { type: String },
    age: { type: Number, min: 18, max: 60 },
    confirmEmail: { type: Date },
    image: { type: String },
    coverImage: { type: [String] },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.SYSTEM,
    },
  },
  {
    collection: "Users",
    timestamps: true,
    strict: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    optimisticConcurrency: true,
    changeCredentialsTime: Date,
  },
);
userSchema
  .virtual("username")
  .set(function (value) {
    const [fristName, lastName] = value?.split(" ") || [];
    this.set({ fristName, lastName });
  })
  .get(function () {
    return `${this.fristName}  ${this.lastName}`;
  });
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
