const {
    create,
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
    getUserByUsername,
    getWorkoutData,
    createRecord,
    suspendOrUnsuspendUser
} = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                //console.log(err);
                return res.json({
                    success: 0,
                    message: err
                });
            }

            return res.json({
                success: 1,
                message: "Account successfully created.",
                data: results
            });
        });
    },
    getUsers: (req, res) => {

        getUsers((err, results) => {
            if (err) {
                //console.log(err);
                return res.send(500).json({
                    success: 0,
                    message: "Failed to fetch users"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        })
    },
    getUserById: (req, res) => {
        const data = req.body;
        getUserById(data, (err, results) => {
            if (err) {
                //console.log(err);
                return res.send(403).json({
                    success: 0,
                    message: "Failed to fetch user"
                });
            }
            return res.status(200).json({
                data: results[0]
            });
        })
    },
    updateUser: (req, res) => {
        const data = req.body;
        const salt = genSaltSync(10);
        data.password = hashSync(data.password, salt);
        updateUser(data, (err, results) => {
            if (err) {
                //console.log(err);
                return res.send(500).json({
                    success: 0,
                    message: "Update error"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Updated successfully"
            });
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data.id, (err, results) => {
            if (err) {
                //console.log(err);
                return res.send(500).json({
                    success: 0,
                    message: "Cannot find requested user to delete"
                });
            }
            if (!results) {
                return res.send(500).json({
                    success: 0,
                    message: "Failed to delete user"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "User Removed"
            });
        })
    },
    suspendOrUnsuspendUser: (req, res) => {
        const data = req.body;
        suspendOrUnsuspendUser(data, (err, results) => {
            if (err) {
                //console.log(err);
                return res.send(500).json({
                    success: 0,
                    message: "Cannot find requested user"
                });
            }
            if (!results) {
                return res.send(500).json({
                    success: 0,
                    message: `${data.active == 2?'Unable to suspend user':'Unable to un-suspend user'}`
                });
            }
            return res.status(200).json({
                success: 1,
                message: `${data.active == 2?'User Unsuspended':'User Suspended (This user will not be able to login!)'}`
            });
        })
    },
    login: (req, res) => {
        const data = req.body;
        try {
            getUserByUsername(data, (err, results) => {
                if (err) {
                    console.log(err);
                }
                if (!results) {
                    return res.json({
                        success: 0,
                        message: "Invalid username or password"
                    })
                }
                const result = compareSync(data.password, results.Password);
                if (result) {
                    results.password = undefined;
                    const jsonToken = sign({ result: results }, process.env.JWT_KEY, {
                        expiresIn: process.env.JWT_ExpiresIn
                    });
                    return res.json({
                        success: 1,
                        message: "login successfully",
                        token: jsonToken,
                        data: {
                            "id": results.Id,
                            "user_name": results.UserName,
                            "role": results.Role
                        }
                    });
                }
                else {
                    return res.json({
                        success: 0,
                        message: "Invalid username or password"
                    });
                }
            });
        }
        catch (err) {
            return res.json({
                success: 0,
                message: "Request error"
            })
        }

    },
    getUserWorkout: (req, res) => {
        const data = req.query;
        getWorkoutData(data,(err, results) => {
            if (err) {

                return res.send(500).json({
                    success: 0,
                    message: "Failed to fetch workout data"
                });
            }
            return res.status(200).json({
                success: 1,
                rows:results
            });
        })
    },
    createWorkoutRecord: (req, res) => {
        const body = req.body;
        createRecord(body, (err, results) => {
            if (err) {
                //console.log(err);
                return res.json({
                    success: 0,
                    message: err
                });
            }

            return res.json({
                success: 1,
                message: "Status updated.",
                data: results
            });
        });
    },
    
}