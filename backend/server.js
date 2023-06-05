const app = require("./app");
const connectDatabase = require("./db/Database");

//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down server for handling uncaught exception`);
})

//config

if(process.env.NODE_ENV !=="PRODUCTION" ){
    require("dotenv").config({
        path:"backend/config/.env"
    })
}

//CONNECT DB

connectDatabase()


//CREATEE SERVER

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is runniung on http://localhost:${process.env.PORT}`);
})

//unhandled promise rejection
process.on("uncaughtException",(err)=>{
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down server for unhandling promise rejection`);

    server.close(()=>{
        process.exit(1)
    })
})