import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import BlogModel from "../models/blog.model";

// Create blog
export const createBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Request body:", req.body); // Log the request body

    const { image, title, description } = req.body;

    // Validate inputs
    if (!image || !title || !description) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    try {
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

      const savedBlog = await BlogModel.create(blog); // Save blog
      console.log("Blog saved:", savedBlog); // Log saved blog

      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: savedBlog, // Return saved blog data
      });
    } catch (error) {
      console.error("Error creating blog:", error); // Log the error
      return next(new ErrorHandler("Failed to create blog", 500));
    }
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
