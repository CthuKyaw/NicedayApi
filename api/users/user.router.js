const express = require("express");
const cors = require("cors");

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    suspendOrUnsuspendUser,
    login, 
    getUserWorkout,
    createWorkoutRecord
    
} = require("./user.controller");

const router = require("express").Router();
router.use(express.json());
router.use(cors({
    origin:"http://localhost:3001",
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}));

const { checkToken } = require("../../auth/token_validation");

router.post("/",checkToken, createUser);
router.get("/all",checkToken, getUsers);
router.get("/single",checkToken, getUserById);
router.patch("/",checkToken, updateUser);
router.delete("/",checkToken, deleteUser);
router.patch("/suspend",checkToken, suspendOrUnsuspendUser);
router.post("/login", login);
router.get("/workout",checkToken,getUserWorkout);
router.post("/workout",checkToken,createWorkoutRecord);

module.exports = router;
