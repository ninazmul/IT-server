import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
} from "../services/blog.service";
import ErrorHandler from "../utils/ErrorHandler";

// Controller to create a new blog
export const uploadBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      const blog = await createBlog(data);
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
