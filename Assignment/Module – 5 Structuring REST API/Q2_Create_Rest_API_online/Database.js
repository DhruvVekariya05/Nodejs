const mysql = require('mysql')

const mysqlconnection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: '',
    database: 'employeedb' 
})

const finalconnection = mysqlconnection.connect((err)=>{
    if(err){
        console.log('Error in db connection');
    }else{
        console.log('Db connected successfully');
    }
})

module.exports = mysqlconnection;