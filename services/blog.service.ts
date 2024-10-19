import BlogModel from "../models/blog.model";
import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler";

// Interface to define blog data structure
interface BlogData {
  title: string;
  description: string;
  headerImage: string | { public_id: string; url: string }; // Allow both string and object
}

// Create a new blog
export const createBlog = async (data: BlogData) => {
  try {
    let headerImage = data.headerImage;

    // If headerImage is a string, upload it to Cloudinary
    if (typeof headerImage === "string") {
      const myCloud = await cloudinary.uploader.upload(headerImage, {
        folder: "blogs",
      });

      headerImage = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    // Create the blog in the database
    const blog = await BlogModel.create({
      title: data.title,
      description: data.description,
      headerImage,
    });

    return blog;
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error creating blog:", error);
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

    // If the blog has a Cloudinary image, delete it
    if (blog.headerImage && typeof blog.headerImage !== "string") {
      await cloudinary.uploader.destroy(blog.headerImage.public_id);
    }

    // Delete the blog from the database
    await blog.deleteOne();

    return { message: "Blog deleted successfully" };
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};
