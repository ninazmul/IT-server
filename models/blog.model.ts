import mongoose, { Document, Model, Schema } from "mongoose";

interface IBlog extends Document {
  title: string;
  description: string;
  headerImage: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    headerImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const BlogModel: Model<IBlog> = mongoose.model("Blog", blogSchema);
export default BlogModel;
