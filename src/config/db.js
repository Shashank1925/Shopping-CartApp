import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('connected to database');
    } catch (error) {
        next(error);
    }
};
export default connectDB;