import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
} from "../controllers/blog.controller";

const blogRouter = express.Router();

blogRouter.post(
  "/upload-blog",
  isAuthenticated,
  authorizeRoles("admin"),
  createBlog
);

blogRouter.get("/all-blogs", getAllBlogs);

blogRouter.get("/blog/:id", getSingleBlog);

blogRouter.delete(
  "/blog/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlog
);

export default blogRouter;
