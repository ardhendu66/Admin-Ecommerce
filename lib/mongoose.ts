import mongoose from "mongoose"
import { envVariables } from "@/config/config"

export const ConnectionWithMongoose = async () => {
    try {
        const response = await mongoose.connect(envVariables.mongodbUrl)
        if(response) {
            console.log('Database connected 😊')            
        }
        else {
            console.log('Database connection error 😕')
            console.log(response)               
        }
    }
    catch(err: any) {
        console.error(err.message)
        throw new Error(err.message)
    }
}