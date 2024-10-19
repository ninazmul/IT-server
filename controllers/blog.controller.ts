import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import BlogModel from "../models/blog.model";

// Create blog
export const createBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, image, title, subTitle } = req.body;

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
          subTitle,
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
  async (req: Request, res: Response, next: NextFunction) => {
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

// Update blog
export const updateBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, image, title, subTitle } = req.body;

    if (type === "Blog") {
      const blogData: any = await BlogModel.findOne({ type: "Blog" });

      if (!blogData) {
        return next(new ErrorHandler("Blog not found for update", 404));
      }

      const data = image.startsWith("https")
        ? blogData.blog.image
        : await cloudinary.v2.uploader.upload(image, {
            folder: "blog",
          });

      const blog = {
        type: "Blog",
        blog: {
          image: {
            public_id: image.startsWith("https")
              ? blogData.blog.image.public_id
              : data.public_id,
            url: image.startsWith("https")
              ? blogData.blog.image.url
              : data.secure_url,
          },
          title,
          subTitle,
        },
      };

      await BlogModel.findByIdAndUpdate(blogData._id, blog, { new: true });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
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

    await BlogModel.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
    await cloudinary.v2.uploader.destroy(blog.blog.image.public_id); // Remove image from Cloudinary

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  }
);
