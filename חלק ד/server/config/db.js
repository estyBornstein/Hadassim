import { connect } from "mongoose";

export const connectToDb = async (req, res) => {
    try {
         await connect(process.env.DB_URI)
        console.log("mongo db connected")
    }
    catch (err) {
        console.log("cannot connect", err)
        process.exit(1)
    }
}