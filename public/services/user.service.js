"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_1 = require("../utils/redis");
// get user by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userJson = yield redis_1.redis.get(id);
        if (userJson) {
            const user = JSON.parse(userJson);
            return user;
        }
        else {
            const user = yield user_model_1.default.findById(id);
            if (user) {
                yield redis_1.redis.set(id, JSON.stringify(user));
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
});
exports.getUserById = getUserById;
// get all users
const getAllUsersService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
});
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = (id, role, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
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
});
exports.updateUserRoleService = updateUserRoleService;
