require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const PhoneBook = require("./models/phonebook");

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


app.use(morgan(function(tokens, request, response) {
    return [
        request.method,
        request.url,
        response.statusCode,
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)
    ]
}));

app.use(express.json()); // middleware to parse JSON bodies
app.use(requestLogger);

app.get("/", (req, res) => {
    res.send("<p>Welcome</p>");
});

app.get("/api/persons", (req, res) => {
    PhoneBook.find({}).then(phoneBooks => {
        res.json(phoneBooks);
    })
});

app.get("/info", (req, res) => {
    PhoneBook.countDocuments({}).then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
    });
});


app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    PhoneBook.findById(id).then(phoneBook => {
        if (phoneBook) {
            res.json(phoneBook);
        } else {
            res.status(404).end();
        }
    }).catch(error => {
        console.log(error);
        res.status(400).send({ error: "malformatted id" });
    });
});


app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = data.find(p => p.id === id);
    if (!person) {
        res.status(404).json({ error: "Person not found" });
        return;
    }

    data = data.filter(p => p.id !== id);
    res.status(204).end();
});


const generateId = () => {
    const maxId = data.length > 0 ? Math.max(...data.map(p => Number(p.id))) : 0;
    return (maxId + 1).toString();
}

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    PhoneBook.findOne({ name: body.name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({ error: "Name must be unique" });
        }

        const phoneBook = new PhoneBook({
            name: body.name,
            number: body.number
        });

        phoneBook.save().then(savedPhoneBook => {
            res.json(savedPhoneBook);
        });
    });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
