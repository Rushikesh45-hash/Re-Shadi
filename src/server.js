import connectdb from "./db/connection.js"
import dotenv from "dotenv"
dotenv.config()

connectdb()
.then(()=>{
    app.listen(process.env.PORT|| 8000, ()=>{
        console.log("Connection success in server.js file")
    })
})
.catch((err)=>{
    console.log("Connection error",err);
})