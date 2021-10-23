const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        
        pool.query(`SELECT * FROM users where UserName = ? AND Active = ?`,
            [data.user_name,1],
            (err, results) => {
                if (err) {
                    callBack(err);
                }
                if(results.length > 0){
                    callBack("User name already taken.")
                }
                else{
                    pool.query(
                        `INSERT INTO users(UserName,Password,ParentId,Role,Active,CreatedDate) VALUES (?,?,?,?,?,now())`,
                        [
                            data.user_name,
                            data.password,
                            data.parent_id,
                            data.role,
                            1,
                        ],
                        (error, results, fields) => {
                            if (error) {
                                callBack(error);
                            }
                            return callBack(null, results);
                        }
                    );
                    
                }
            }
        )
        
        
    },
    getUsers: callBack => {
        pool.query(`SELECT Id,UserName,ParentId,Role,Active,Token FROM users WHERE 
        Active = ? OR Active = ?`,
            [1, 2], (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            })
    },
    getUserById: (data, callBack) => {
        //console.log(data);
        pool.query(`SELECT Id,UserName,ParentId,Role,Active,Token FROM users WHERE Id = ?`,
            [data.id], (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            })
    },
    updateUser: (data, callBack) => {
        pool.query(`UPDATE users SET userName=?,ParentId=?,Role=?,Active=?,Token=? WHERE Id = ?`,
            [
                data.user_name,
                data.parentId,
                data.role,
                data.active,
                data.token,
                data.id
            ], (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            })
    },
    suspendOrUnsuspendUser: (data, callBack) => {
        var sql = `SET @UserId = ?; 
        CALL SuspendOrUnSuspendUser(@UserId);`;

        pool.query(sql,[data.id],(err,results,fields)=>{
            if (err) {
                callBack(err);
            }
            else{
                callBack(null,results)
            }
        });
    },
    deleteUser: (id, callBack) => {
        pool.query(`DELETE users WHERE Id = ?`,
            [
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            })
    },
    getUserByUsername: (data, callback) => {
        pool.query(`SELECT * FROM users where UserName = ? AND Active = ?`,
            [data.user_name,1],
            (err, results) => {
                if (err) {
                    callback(err);
                }
                return callback(null, results[0]);
            }
        )

    },
    getWorkoutData: (data, callBack) => {

        var sql = `SET @UserId = ?;SET @Role = ?;
        CALL GetWorkoutDataByRole(@UserId, @Role);`;

        pool.query(sql,[data.userId,data.role],(err,results,fields)=>{
            if (err) {
                callBack(err);
            }
            else{
                
                callBack(null,results[2])
            }
        });

    },
    createRecord: (data, callBack) => {
        
        var sql = `SET @UserId = ?;SET @Status = ?;
        SET @Note = ?;CALL WorkoutAddOrUpdate(@UserId, @Status, @Note);`;

        pool.query(sql,[data.userId,data.status,data.note],(err,results,fields)=>{
            if (err) {
                callBack(err);
            }
            else{
                callBack(null,results)
            }
        });
    },
};