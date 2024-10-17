import BlogModel from "../models/blog.model";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler";

// Interface to define blog data structure
interface BlogData {
  title: string;
  description: string;
  headerImage: string | { public_id: string; url: string }; // Adjusted to allow both string and object
}

// Create a new blog
export const createBlog = async (data: BlogData) => {
  try {
    let headerImage = data.headerImage;

    if (typeof headerImage === "string") {
      const myCloud = await cloudinary.v2.uploader.upload(headerImage, {
        folder: "blogs",
      });

      headerImage = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const blog = await BlogModel.create({
      title: data.title,
      description: data.description,
      headerImage,
    });

    return blog;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Fetch all blogs
export const getAllBlogs = async () => {
  try {
    const blogs = await BlogModel.find().select(
      "title description headerImage createdAt"
    );
    return blogs;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Fetch a single blog by ID
export const getSingleBlog = async (id: string) => {
  try {
    const blog = await BlogModel.findById(id).select(
      "title description headerImage createdAt"
    );
    if (!blog) {
      throw new ErrorHandler("Blog not found", 404);
    }
    return blog;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Delete a blog
export const deleteBlog = async (id: string) => {
  try {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      throw new ErrorHandler("Blog not found", 404);
    }

    // Remove the image from Cloudinary if it exists
    if (blog.headerImage && typeof blog.headerImage !== "string") {
      await cloudinary.v2.uploader.destroy(blog.headerImage.public_id);
    }

    // Delete the blog from the database
    await blog.deleteOne();

    return { message: "Blog deleted successfully" };
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};
