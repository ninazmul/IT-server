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
  "/upload",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadBlog
);
blogRouter.get("/all", getAllBlogsController);
blogRouter.get("/:id", getSingleBlogController);
blogRouter.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlogController
);

export default blogRouter;
