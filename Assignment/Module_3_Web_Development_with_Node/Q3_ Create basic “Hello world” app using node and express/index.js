//Q3 . Create basic “Hello world” app using node and express.
const libexpress = require("express");

const app = libexpress();

app.get("/",(req,res)=>{

    res.send("Hello World...!!")

})

app.listen(4000,()=>{
    console.log("Server started at port 4000........");
})