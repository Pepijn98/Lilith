import User from "~/types/mongo/User";
import { Document, Schema, Model, model } from "mongoose";

export interface UserModel extends User, Document {}

const UserSchema = new Schema<UserModel>({
    uid: { unique: true, type: String },
    region: String,
    locale: String,
    battleTag: String
});

export const Users: Model<UserModel> = model<UserModel>("User", UserSchema);

export default Users;
