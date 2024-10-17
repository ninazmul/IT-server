import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
} from "../services/blog.service";
import ErrorHandler from "../utils/ErrorHandler";
import { v2 as cloudinary } from "cloudinary";

// Create blog controller
export const uploadBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, image } = req.body;

    if (!image) {
      return next(new ErrorHandler("Please upload an image", 400));
    }

    try {
      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "blogs", // optional folder in Cloudinary
        use_filename: true,
      });

      const blogData = {
        title,
        description,
        headerImage: uploadResult.secure_url, // Get the secure URL of the uploaded image
      };

      const blog = await createBlog(blogData);
      res.status(201).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Controller to fetch all blogs
export const getAllBlogsController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await getAllBlogs();
      res.status(200).json({
        success: true,
        blogs,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Controller to fetch a single blog
export const getSingleBlogController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Extracting id from params

    try {
      const blog = await getSingleBlog(id); // Fetching blog by ID
      if (!blog) {
        return next(new ErrorHandler("Blog not found", 404)); // Handle blog not found
      }
      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Controller to delete a blog
export const deleteBlogController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Extracting id from params

    try {
      const result = await deleteBlog(id); // Deleting blog by ID
      if (!result) {
        return next(new ErrorHandler("Blog not found", 404)); // Handle blog not found
      }
      res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
