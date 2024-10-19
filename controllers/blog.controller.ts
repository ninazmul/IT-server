import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import BlogModel from "../models/blog.model";

// Create blog
export const createBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, image, title, description } = req.body;

    // Check if type already exists
    const isTypeExist = await BlogModel.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} already exists`, 400));
    }

    if (type === "Blog") {
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "blog",
      });
      const blog = {
        type: "Blog",
        blog: {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          description,
        },
      };
      await BlogModel.create(blog);
    }

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
    });
  }
);

// Get all blogs
export const getAllBlogs = CatchAsyncError(
  async (req: Request, res: Response) => {
    const blogs = await BlogModel.find();

    res.status(200).json({
      success: true,
      blogs,
    });
  }
);

// Get single blog
export const getSingleBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    res.status(200).json({
      success: true,
      blog,
    });
  }
);

// Delete blog
export const deleteBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    await BlogModel.deleteOne({ _id: req.params.id });
    await cloudinary.v2.uploader.destroy(blog.blog.image.public_id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  }
);
