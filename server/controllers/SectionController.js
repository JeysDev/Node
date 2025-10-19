import { node_js_training } from "../database/MysqlConnection.js";

class Section {
    static async getSections(erq, res){
        try{
            const sql =`SELECT * FROM sections`;

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
    static async insertSections(req, res){
        try{
            const {section_code, section_name} = req.body;

            const sql =`INSERT INTO sections(
                section_code,
                section_name,
                created_at,
                updated_at,
                deleted_at
            )
                VALUES ( ?, ?, NOW(), NOW(), NULL)`;
            const data = await node_js_training.query(sql, [
                section_code, 
                section_name
            ]);
            res.status(200).json({
                message:'Section Inserted Successfully',
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
    static async updateSections(req, res){
        try{
            const {section_code, section_name} = req.body;

            const sql =`UPDATE sections
            SET
                section_code =?,
                section_name =?,
                updated_at = NOW()
            
                WHERE id= ?`;
            const data = await node_js_training.query(sql, [
                section_code, 
                section_name,
                req.params.id
                
            ]);
            res.status(200).json({
                message:'Section Inserted Successfully',
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
    static async deleteSections(req, res){
        try{
            const sql =`UPDATE sections
            SET
                deleted_at = NOW()
            
                WHERE id= ?`;
            const data = await node_js_training.query(sql, [
                req.params.id
            ]);
            res.status(200).json({
                message:'Section Deleted Successfully',
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
    static async restoreSections(req, res){
        try{
            const{
                id
            } =req.body;

            const sql =`
            UPDATE sections
            SET
            deleted_at = NULL
            WHERE id = ?
            `
            await node_js_training.query(sql,[id]);
            res.status(200).json({message: "Retore " + req.body.section_name,
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

export default Section;
