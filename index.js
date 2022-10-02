const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const morgan = require("morgan")
const Entry = require("./models/entry")

app.use(express.json())
morgan.token("body", (req) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :response-time ms :body"))
app.use(cors())
app.use(express.static("build"))

app.get("/api/persons", (request, response) => {
    Entry.find({}).then((result) => {
        response.json(result)
    })
})

app.get("/info", (request, response) => {
    const stamp = new Date()
    Entry.find({}).then((result) => {
        const entries = result.length
        response.send(
            `<h3>Phonebook has info for ${entries} people<br>${stamp}</h3>`
        )
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Entry.findById(request.params.id)
        .then((entry) => {
            if (entry) {
                response.json(entry)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => {
            next(error)
        })
})

app.delete("/api/persons/:id", (request, response, next) => {
    Entry.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    const entry = new Entry({
        name: body.name,
        number: body.number,
    })
    Entry.findOne({ name: body.name }).then((foundName) => {
        console.log(foundName)
    })
    entry
        .save()
        .then((savedPerson) => {
            response.json(savedPerson)
        })
        .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body
    const entry = {
        name: body.name,
        number: body.number,
    }
    Entry.findByIdAndUpdate(request.params.id, entry, {
            new: true,
            runValidators: true,
            context: "query",
        })
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }
    next(error)
};

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})