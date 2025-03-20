import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"]
    },
    tokens: [String],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;