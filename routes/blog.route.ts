import express from "express";
import {
  deleteBlogController,
  getAllBlogsController,
  getSingleBlogController,
  uploadBlog,
} from "../controllers/blog.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const blogRouter = express.Router();

blogRouter.post(
  "/upload-blog",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadBlog
);
blogRouter.get("/all-blog", getAllBlogsController);
blogRouter.get("/blog/:id", getSingleBlogController);
blogRouter.delete(
  "/blog/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlogController
);

export default blogRouter;
