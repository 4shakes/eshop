const mongoose = require("mongoose")

const connectDatabase = ( )=>{

    //. La primera es useNewUrlParser: true, que permite a Mongoose analizar la cadena de conexión de la base de datos de forma adecuada. La segunda opción es useUnifiedTopology: true, que utiliza la topología unificada de MongoDB para administrar la conexión de forma más eficiente.
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then((data)=>{
        console.log(`mongod connected with server: ${data.connection.host}`);
    })
}

module.exports = connectDatabase