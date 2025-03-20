import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [String]
});
const AdminModel = mongoose.model("admin", adminSchema);
export default AdminModel;