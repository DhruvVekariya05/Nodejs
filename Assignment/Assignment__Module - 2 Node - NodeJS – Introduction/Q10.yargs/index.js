const libyargs = require('yargs')
const libfs = require('fs')
const yargs = require('yargs')

const Finalresult = libyargs.option('add',{
    alias: 'add',
    type: 'string',
    description: 'add a new name'
}).option('remove',{
    alias: 'remove',
    type: 'string',
    description: 'remove the name'
}).option('update',{
    alias: 'update',
    type: 'string',
    description: 'update new name'
}).help().argv

//how to run 
//node index.js --add="name is dhruv"
if(Finalresult.add){
    libfs.appendFile('sample.txt',Finalresult.add,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("data add is complit");
        }
    })
}
//how to run
//node index.js --remove="name is e1"
if(Finalresult.remove){
    libfs.readFile('sample.txt','utf-8',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            const newdata = data.replace(Finalresult.remove,"")
            libfs.writeFile('sample.txt',newdata,(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log("data deletad successfully.....")
                }
            })
        }
    })
}

//how to run
//node index.js --update="name is jay"
if(Finalresult.update){
    libfs.readFile('sample.txt','utf-8',(error,data)=>{
        if(error)
            {
                console.log(error)
            }else{
                const newvalue = data.replace(Finalresult.update,Finalresult.newdata)

                libfs.writeFile('sample.txt',newvalue,(error)=>{
                    if(error){
                        console.log(error);
                    }else{
                        console.log("data updated successfully.....")
                    }                    
                })
            }
    })
}
