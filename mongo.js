const mongoose = require("mongoose")

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://Ilmag:${password}@cluster0.mk295gr.mongodb.net/Phonebook?retryWrites=true&w=majority`

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model("Entry", phoneSchema)

if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then(() => {
            Entry.find({}).then((result) => {
                console.log("phonebook:")
                result.forEach((entry) => console.log(entry.name, entry.number))
            })
        })
        .then(() => {
            return mongoose.connection.close()
        })
        .catch((error) => console.log(error))
} else if (process.argv.length === 5) {
    mongoose
        .connect(url)
        .then((result) => {
            console.log(`added ${name} number ${number} to phonebook`)
            const entry = new Entry({
                name: name,
                number: number,
            })
            return entry.save()
        })
        .then(() => {
            return mongoose.connection.close()
        })
        .catch((error) => {
            console.log(error)
        })
} else {
    console.log("Enter Password (required), Name and Number")
}