import { MongoClient } from "mongodb"
import { envVariables } from "@/config/config"

declare global {
    namespace globalThis {
        var _mongoClientPromise: Promise<MongoClient>
    }
}

if (!envVariables.mongoLocalUrl) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = envVariables.mongoLocalUrl
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} 
else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise