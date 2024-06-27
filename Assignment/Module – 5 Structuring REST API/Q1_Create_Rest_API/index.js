const libexpress = require('express');
const Emprouter = require('./connection');

const App = libexpress();

//ask the app to use json
App.use(libexpress.json()); 


App.use("/restapi",Emprouter)

App.listen(3000,()=>{console.log("server started at 3000 port");})