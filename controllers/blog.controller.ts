import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
} from "../services/blog.service";
import ErrorHandler from "../utils/ErrorHandler";

// Route handler for creating a new blog
export const uploadBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body;
    const headerImage = req.file?.path; // Assuming you are using multer or a similar package to handle file uploads

    if (!title || !description || !headerImage) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const blog = await createBlog({ title, description, headerImage });
    res.status(201).json({ success: true, blog });
  }
);


// Route handler for fetching all blogs
export const getAllBlogsController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogs = await getAllBlogs();
    res.status(200).json({ success: true, blogs });
  }
);

// Route handler for fetching a single blog by ID
export const getSingleBlogController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const blog = await getSingleBlog(id);
    res.status(200).json({ success: true, blog });
  }
);

// Route handler for deleting a blog
export const deleteBlogController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await deleteBlog(id);
    res.status(200).json({ success: true, message: result.message });
  }
);
