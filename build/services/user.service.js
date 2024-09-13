"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_1 = require("../utils/redis");
// get user by id
const getUserById = async (id) => {
    try {
        const userJson = await redis_1.redis.get(id);
        if (userJson) {
            const user = JSON.parse(userJson);
            return user;
        }
        else {
            const user = await user_model_1.default.findById(id);
            if (user) {
                await redis_1.redis.set(id, JSON.stringify(user));
                return user;
            }
            else {
                return null;
            }
        }
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};
exports.getUserById = getUserById;
// get all users
const getAllUsersService = async (res) => {
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = async (id, role, res) => {
    try {
        const user = await user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
        if (user) {
            res.status(200).json({
                success: true,
                user,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "User update failed",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateUserRoleService = updateUserRoleService;
