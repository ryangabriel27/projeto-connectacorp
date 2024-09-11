import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    icone: {
        type: String
    },
    cargo: {
        type: String
    },
    setor: {
        type: String
    }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;