import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


if (!process.env.MONGO_DB_URI) {
  throw new Error("MONGO_DB_URI environment variable is missing inside .env.local");
}


const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
   
    client
  }),
  emailAndPassword: { 
    enabled: true, 
  },
});