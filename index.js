const express = require("express");
const app = express();
const morgan = require("morgan");

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

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("<p>Welcome</p>");
});

app.get("/api/persons", (req, res) => {
    res.json(data);
});

app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`);
});


app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = data.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: "Person not found" });
    }
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
    
    const doesNameExist = data.some(p => p.name === body.name);
    if (doesNameExist) {
        return res.status(400).json({ error: "Name must be unique" });
    }

    
    const person = {
        id: generateId(),
        name: body.name, 
        number: body.number
    }

    data = data.concat(person);
    res.status(201).json([{message: "Person added"}, { person: person }]);
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
