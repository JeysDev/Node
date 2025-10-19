import { node_js_training } from "../database/MysqlConnection.js";

class Team {
    static async getTeams(erq, res){
        try{
            const sql =`SELECT * FROM teams`;

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
    static async insertTeam(req, res){
        try{
            const {department_code, department_name} = req.body;

            const sql =`INSERT INTO teams(
                team_code,
                team_name,
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
    static async updateTeam(req, res){
        try{
            const {team_code, team_name} = req.body;
            const sql = `UPDATE teams
             SET
              team_name = ?,
              team_code = ?
            WHERE id=?`;
            const data = await node_js_training.query(sql, [
                team_name, team_code, req.params.id
                ]);
                res.status(200).json({
                    message: 'Team Updated Successfully',
                    status: 'ok',
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
    static async deleteTeam(req, res){
        try{
            const sql =`UPDATE teams
            SET
                deleted_at = NOW()
            
                WHERE id= ?`;
            const data = await node_js_training.query(sql, [
                req.params.id
            ]);
            res.status(200).json({
                message:'Team Deleted Successfully',
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
    static async restoreTeam(req, res){
        try{
            const{
                id
            } =req.body;

            const sql =`
            UPDATE teams
            SET
            deleted_at = NULL
            WHERE id = ?
            `
            await node_js_training.query(sql,[id]);
            res.status(200).json({message: "Retore " + req.body.team_name,
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

export default Team;
