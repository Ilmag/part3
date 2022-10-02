require("dotenv").config()
const mongoose = require("mongoose")

// const url =
//     "mongodb+srv://Ilmag:Saerto2022@cluster0.mk295gr.mongodb.net/Phonebook?retryWrites=true&w=majority";

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose
    .connect(url)
    .then(() => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.massege)
    })

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (s) => {
                return /\d{3}-\d*|\d{2}-\d*/.test(s)
            },
            message: "Phone number format is not valid.",
        },
        required: true,
    },
})

entrySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})


module.exports = mongoose.model("Entry", entrySchema)