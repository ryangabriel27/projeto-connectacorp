import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titulo: {
        type: String
    },
    conteudo: {
        type: String,
        required: true
    },
    comentarios:{
        type: String
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;