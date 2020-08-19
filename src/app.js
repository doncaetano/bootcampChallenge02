const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

function validarUuid(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ msg: 'Invalid userID' })
    }

    return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validarUuid);

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const likes = 0;

    const repositorie = {
        id: uuid(),
        title,
        url,
        techs,
        likes
    }

    repositories.push(repositorie);

    return response.status(201).json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repIndex = repositories.findIndex(x => x.id == id)

    if (repIndex === -1) {
        return response.status(400).send();
    }

    const repositorie = {...repositories[repIndex] }

    repositorie.title = title;
    repositorie.url = url;
    repositorie.techs = techs;

    repositories[repIndex] = repositorie;

    return response.status(201).json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repIndex = repositories.findIndex(x => x.id == id)

    if (repIndex === -1) {
        return response.status(400).json({ msg: 'UserID not found' })
    }

    repositories.splice(repIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const repIndex = repositories.findIndex(x => x.id == id)

    if (repIndex === -1) {
        return response.status(400).json({ msg: 'UserID not found' })
    }

    const repositorie = {...repositories[repIndex] }
    repositorie.likes += 1;

    repositories[repIndex] = repositorie;

    return response.status(200).json(repositorie);

});

module.exports = app;