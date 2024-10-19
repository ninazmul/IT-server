import { Schema, Document, model } from "mongoose";

interface BlogImage extends Document {
  public_id: string;
  url: string;
}

interface Blog extends Document {
  type: string;
  blog: {
    image: BlogImage;
    title: string;
    description: string; // Ensure this matches your request and update
  };
}

const blogImageSchema = new Schema<BlogImage>({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
});

const blogSchema = new Schema<Blog>({
  type: { type: String, required: true },
  blog: {
    image: blogImageSchema,
    title: { type: String, required: true },
    description: { type: String, required: true }, // Ensure this matches your request and update
  },
});

const BlogModel = model<Blog>("Blog", blogSchema);
export default BlogModel;
