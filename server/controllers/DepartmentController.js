import { node_js_training } from "../database/MysqlConnection.js";

class Department {
    static async getDepartments(req, res){
        try{
            const sql =`SELECT * FROM departments`;

            const data = await node_js_training.query(sql);

            res.status(200).json({
                message: 'success',
                status: 'ok',
                data: data[0]
            });
            }catch(err){
                console.error('Error fetching message: ' + err);
                res.status(500).json({
                    message: 'Error fetching message' + err,
                    status: 'error',
                });
            }
    }
    static async insertDepartment(req, res){
        try{
            const {department_code, department_name} = req.body;

            const sql =`INSERT INTO departments(
                department_code,
                department_name,
                created_at,
                updated_at,
                deleted_at
            )
                VALUES ( ?, ?, NOW(), NOW(), NULL)`;
            const data = await node_js_training.query(sql, [
                department_code, 
                department_name
            ]);
            res.status(200).json({
                message:'Department Inserted Successfully',
                status:'ok',
                data: data[0]
            });
        }
        catch(err){
            console.error('Error inserting data: ' + err);
            res.status(500).json({
                message: 'Error inserting Data' + err,
                status: 'error',
            });
        }
    }    
    static async updateDepartment(req, res){
        try{
            const {department_code, department_name} = req.body;

            const sql =`UPDATE departments
            SET
                department_code = ?,
                department_name = ?,
                updated_at = NOW()
            
                WHERE id= ?`;
            const data = await node_js_training.query(sql, [
                department_code, 
                department_name,
                req.params.id
            ]);
            res.status(200).json({
                message:'Department Updated Successfully',
                status:'ok',
                data: data[0]
            });
        }
        catch(err){
            console.error('Error updating data: ' + err);
            res.status(500).json({
                message: 'Error updating Data' + err,
                status: 'error',
            });
        }
    }
    static async deleteDepartment(req, res){
        try{
            const sql =`UPDATE departments
            SET
                deleted_at = NOW()
            
                WHERE id= ?`;
            const data = await node_js_training.query(sql, [
                req.params.id
            ]);
            res.status(200).json({
                message:'Department Deleted Successfully',
                data: data[0]
            });
        }
        catch(err){
            console.error('Error deleting data: ' + err);
            res.status(500).json({
                message: 'Error deleting Data' + err,
                status: 'error',
            });
        }
    }
    static async restoreDepartment(req, res){
        try{
            const{
                id
            } =req.body;

            const sql =`
            UPDATE departments
            SET
            deleted_at = NULL
            WHERE id = ?
            `
            await node_js_training.query(sql,[id]);
            res.status(200).json({message: "Retore " + req.body.department_name,
                status:'ok',
            });
        }
        catch(err){ // catch any error that occurs during the process
            ('error saving message:' +err);
            res.status(500).json({
                message: 'Error saving data: '+ err,
                status:'error',
            });
        }
    }

};

export default Department;
