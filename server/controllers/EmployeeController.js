import { node_js_training } from "../database/MysqlConnection.js";

class Employee{ //get data in employees
    static async getEmployees(req, res){
        // const employees=[
        //     {name: 'Jeys'},
        //     {name:'Jm'},
        //     {name: 'Ray'},
        //     {name: 'Yen'},
        //     {name: 'Jham'},
        // ];
        // res.status(200).json({message: "Success",
        //     status:'ok',
        //     data: employees});

        //fetching data from database using promise
        const sql =`SELECT * FROM employees`;
        // node_js_training.query('SELECT * FROM employees')
            // .then(([data]) =>{ //then the data will transfer into data array
            //     res.status(200).json({message: "Success", //then it will display a surtain message if the fetching is success
            //         status:'ok',
            //         data:data[0], //data[0] is the first data in the array
            //     })
            // }).catch((err)=>{ //this will catch an error if error exist
            //     console.error('Error fetching message:',err);
            //     res.status(500).json({
            //         status: 'error',
            //         message:'Error fetching data:'+ err,
            //     })
            // });
            
            //.ASYNC AWAIT
        try{
            const data = await node_js_training.query(sql);
            res.status(200).json({message: "Success",
                status:'ok',
                data:data[0],
                });
        } 
        catch(err){
            console.error('Error fetching message:', err);
            res.status(500).json({
                message: 'Error fetching data: '+ err,
                status:'error',
            });
        }
    };
    static async insertEmployee(req, res){
        try{
            const{ // get data from req.body
                employee_code,
                employee_name,
                department_code,
                section_code,
                team_code                
            } = req.body; // destructuring the data from req.body

            // insert data into database
            const sql =`INSERT INTO employees ( 
                employee_code,
                employee_name,
                department_code,
                section_code,
                team_code,
                created_at,
                deleted_at
            )
                VALUES (?, ?, ?, ?, ?, NOW(), NUll)`
            await node_js_training.query(sql,[ // insert data into database
                employee_code,
                employee_name,
                department_code,
                section_code,
                team_code
            ]);
            res.status(200).json({message: "Success", // send response back to client
                status:'ok',   
            });
        } 
        catch(err){ // catch any error that occurs during the process
            ('error saving message:' +err);
            res.status(500).json({
                message: 'Error saving data: '+ err,
                status:'error',
            })

        }
    }   
    static async updateEmployee(req, res){
        try{
            const{ // get data from req.body
                id,
                employee_code,
                employee_name,
                department_code,
                section_code,
                team_code                
            } = req.body; // destructuring the data from req.body

            // insert data into database
            const sql =`
            UPDATE employees 
            SET
                employee_code =?,
                employee_name =?,
                department_code =?,
                section_code =?,
                team_code =?
            WHERE id = ?
            `
            await node_js_training.query(sql,[ // insert data into database
                employee_code,
                employee_name,
                department_code,
                section_code,
                team_code,
                id
            ]);
            res.status(200).json({message: "Success", // send response back to client
                status:'ok',   
            });
        } 
        catch(err){ // catch any error that occurs during the process
            ('error saving message:' +err);
            res.status(500).json({
                message: 'Error saving data: '+ err,
                status:'error',
            })

        }
    }    
    static async deleteEmployee(req, res){
        try{
            const{ // get data from req.body
                id
            } = req.body; // destructuring the data from req.body

            // insert data into database
            const sql =`
            UPDATE employees 
            SET
                deleted_at = NOW()
            WHERE id = ?
            `
            await node_js_training.query(sql,[ // insert data into database
                id
            ]);
            res.status(200).json({message: "Deleting " + req.body.employee_name,  // send response back to client
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
    static async restoreEmployee(req, res){
        try{
            const{
                id
            } =req.body;

            const sql =`
            UPDATE employees
            SET
            deleted_at = NULL
            WHERE id = ?
            `
            await node_js_training.query(sql,[id]);
            res.status(200).json({message: "Retore " + req.body.employee_name,
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
}
//COMMON JS
// module.exports = Employee;
//ES MODULE
export default Employee;