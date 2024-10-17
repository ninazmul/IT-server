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

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "blogs", // optional folder in Cloudinary
      use_filename: true,
    });

    const imagePath = uploadResult.secure_url; // Get the secure URL of the uploaded image

    const blogData = {
      title,
      description,
      headerImage: imagePath,
    };

    try {
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
    try {
      const blog = await getSingleBlog(req.params.id);
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
    try {
      const result = await deleteBlog(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
