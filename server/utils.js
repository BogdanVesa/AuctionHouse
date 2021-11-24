const db=require("./config/db").db


const findByField = async (table,collumn,value) => {
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM ?? where ?? = ?',[table,collumn,value],(err,result)=>{
            if(err)
                reject(err);
            resolve(result);
        })
    })
}
const insert = async (table,fields,values) =>{
    return new Promise((resolve, reject) =>{
         db.query('INSERT INTO ?? (??) values (?)',[table,fields,values],(err,result) =>{
            if(err)
                {
                    console.log(err)
                    reject(false);
                }
            resolve(result);
        })
    })
}

const getAllRows = async (table,fields) => {

    return new Promise((resolve, reject) =>{
       
        var query = db.query("SELECT ?? from ??",[fields,table],(err,result) => {
            // console.log(query);
            if(err)
                reject(err);
            resolve(result);
        })
        
    })
}
const getAllRowsWhere = async (table,fields,conditionField,value) =>
{
    return new Promise ((resolve,reject) => {
        var query = db.query("SELECT ?? FROM ?? WHERE ?? = ?",[fields,table,conditionField,value],(err,result) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(result);
        })

    })
}
module.exports={findByField,insert,getAllRows,getAllRowsWhere}