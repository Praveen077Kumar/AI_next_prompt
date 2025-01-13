import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async()=>{
    mongoose.set('strictQuery',true);

    if(isConnected){
        console.log('MongoDb is already Connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName:"prompt",
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        isConnected=true,
        console.log('Connected to MongoDb')
    } catch (error) {
        console.error(error)
    }

}