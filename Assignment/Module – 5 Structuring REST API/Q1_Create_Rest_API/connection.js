const libexpress = require('express');

const EmpData = libexpress.Router();

let AllemployeeData = [

    {id:"1",name:"e1"},
    {id:"2",name:"e2"},
    {id:"3",name:"e3"}

]

//GET.........................................................

//get all employee
EmpData.get("/employee",(req,res)=>{
    res.status(200).json(AllemployeeData)
})

//spicific employee to find
EmpData.get("/employee/:id",(req,res)=>{
    const result = AllemployeeData.filter((employee)=>{
        return employee.id == req.params.id
    })

    if(result.length>0)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(400).json({error:"no data found "});   
        }
    
})
 
//POST.........................................................

EmpData.post("/employee",(req,res)=>{
    AllemployeeData.push(req.body)
    res.status(201).json({msg:"created succesfully...."});
})

//DELETE.........................................................
EmpData.delete("/employee/:id",(req,res)=>{
    AllemployeeData = AllemployeeData.filter((employee)=>employee.id!=req.params.id)
    res.status(204).json();
})


//PUT.........................................................
EmpData.put("/employee/:id",(req,res)=>{
    AllemployeeData = AllemployeeData.map((employee)=>{

        if(employee.id==req.params.id){
            employee=req.body
        }
        return employee;
    })
    res.status(200).json({"msg":"updated......"})
})

//PATCH.........................................................
EmpData.patch("/employee/:id",(req,res)=>{
    AllemployeeData = AllemployeeData.map((employee)=>{

        if(employee.id==req.params.id){
            employee={...employee,...req.body}
        }
        return employee;
    })
    res.status(200).json({"msg":"updated......"})
})

module.exports=EmpData;