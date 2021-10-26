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
    origin:"http://156.67.216.116",
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}));

const { checkToken } = require("../../auth/token_validation");

const logConfiguration = {
    transports: [
        new winston.transports.File({
            level: 'error',
            // Create the log directory if it does not exist
            filename: '../../../logs/error.log'
        })
    ]
};

var logger = new winston.createLogger(logConfiguration);


try{
    router.post("/users",createUser);
    router.get("/users/all",checkToken, getUsers);
    router.get("/users/single",checkToken, getUserById);
    router.patch("/users",checkToken, updateUser);
    router.delete("/users",checkToken, deleteUser);
    router.patch("/users/suspend",checkToken, suspendOrUnsuspendUser);
    router.post("/users/login", login);
    router.get("/workout",checkToken,getUserWorkout);
    router.post("/workout",checkToken,createWorkoutRecord);
}
catch(e){
    logger.error(`Error at user.router. \n ${e}`);
}



module.exports = router;
