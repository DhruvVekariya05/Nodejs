const finalconnection = require('./Database');
const libexpress = require('express');
const BodyParser = require('body-parser');

const App = libexpress();

App.use(BodyParser.json());
//GET all 
App.get('/empolyees',(req,res)=>{

    finalconnection.query('SELECT * FROM empdata',(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })
})
//GET the Data
App.get('/empolyees/:id',(req,res)=>{

    const employeeId = req.params.id;

    finalconnection.query('SELECT * FROM empdata WHERE id = ?',[employeeId],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })
})

//post data
App.post('/empolyees',(req,res)=>{

    const emp = req.body;
    const empdata = [emp.name,emp.salary,emp.position]
    finalconnection.query('INSERT INTO empdata(name,salary,position) VALUES(?)',[empdata],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })
})

//PUT data
App.put('/empolyees/:id', (req, res) => {
console.log("put method called...");
    const emp = req.body;
    const id = req.params.id;
console.log("id is "+id);
    finalconnection.query('UPDATE empdata SET ? WHERE id =?',[emp,id], (err, rows) => {
       
        if (err) {
            console.log("error is"+err);
            res.status(204).json({"error":"error"})
        } else {
            if(rows.affectedRows === 0){
                const empdata = [
                    {id : id},
                    {name: emp.name},
                    {salary: emp.salary},
                    {position: emp.position}
                ]
                finalconnection.query('INSERT INTO empdata SET ?',empdata,(err,rows)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(rows);
                    }
    })
            }else{
            res.send(rows);
            }
        }
    });
});


//PATCH data
App.patch('/empolyees/:id', (req, res) => {

    const emp = req.body;
    const id = req.params.id;

    finalconnection.query('UPDATE empdata SET ? WHERE id =?',[emp,id], (err, rows) => {
       
        if (err) {
            console.log("error is"+err);
            res.status(204).json({"error":"error"})
        } else {
            if(rows.affectedRows === 0){
                const empdata = [
                    {id : id},
                    {name: emp.name},
                    {salary: emp.salary},
                    {position: emp.position}
                ]
                finalconnection.query('INSERT INTO empdata SET ?',empdata,(err,rows)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(rows);
                    }
    })
            }else{
            res.send(rows);
            }
        }
    });
});



//DELETE the Data
App.delete('/empolyees/:id',(req,res)=>{

    const employeeId = req.params.id;

    finalconnection.query('DELETE FROM empdata WHERE id = ?',[employeeId],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })

})

App.listen(3000,()=>{console.log('server started in port 3000');});

