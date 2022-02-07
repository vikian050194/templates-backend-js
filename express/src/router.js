const express = require("express");
const router = express.Router();
const Repository = require("./repository");
const repo = new Repository();

[{
    description: "Foo",
    isCompleted: true,
    id: 1
},
{
    description: "Bar",
    isCompleted: false,
    id: 2
},
{
    description: "Buz",
    isCompleted: false,
    id: 3
}
].forEach((item => repo.addItem(item)));

router.route("/list/:id*?")
    .get(function (req, res) {
        const {
            id
        } = req.params;

        if (id) {
            res.send(repo.getItem(id));
        } else {
            res.send(repo.getItems());
        }

    })
    .post(function (req, res) {
        const {
            id
        } = req.params;

        const {
            isCompleted,
            description
        } = req.body;

        if (id) {
            res.sendStatus(404);
            return;
        }

        const addedItem = repo.addItem({
            isCompleted,
            description
        });

        res.send({
            status: 200,
            content: addedItem
        });
    })
    .put(function (req, res) {
        const {
            id
        } = req.params;

        if (!id || (id && !repo.getItem(id))) {
            res.sendStatus(404);
        }

        const {
            isCompleted,
            description
        } = req.body;

        repo.updateItem({
            id,
            isCompleted,
            description
        });

        res.sendStatus(204);
    })
    .patch(function (req, res) {
        const {
            id
        } = req.params;

        if (!id || (id && !repo.getItem(id))) {
            res.sendStatus(404);
        }

        const {
            isCompleted,
            description
        } = req.body;

        const item = repo.getItem(id);

        repo.updateItem({ ...item, id, isCompleted, description });

        res.sendStatus(204);
    })
    .delete(function (req, res) {
        const {
            id
        } = req.params;

        if (!id || (id && !repo.getItem(id))) {
            res.sendStatus(404);
        }

        repo.deleteItem(id);

        res.sendStatus(204);
    });

router.route("*")
    .all(function (req, res) {
        res.sendStatus(404);
    });

module.exports = router;