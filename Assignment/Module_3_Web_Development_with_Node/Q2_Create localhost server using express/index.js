//Q2 .Create localhost server using express.
const libexpress = require("express");

const app = libexpress();

app.listen(3000,()=>{
    console.log("Server started at port 3000........");
})