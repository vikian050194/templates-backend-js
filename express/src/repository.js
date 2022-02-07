class Repository {
    constructor() {
        this.dictionary = {};
        this.seed = 1;
    }

    getItem(id) {
        return this.dictionary[id];
    }

    addItem(item) {
        item.id = this.seed++;

        this.dictionary[item.id] = {
            isCompleted: item.isCompleted,
            description: item.description
        };

        return this.dictionary[item.id];
    }

    updateItem(item) {
        this.dictionary[item.id] = {
            isCompleted: item.isCompleted,
            description: item.description
        };
    }

    deleteItem(id) {
        delete this.dictionary[id];
    }

    getItems() {
        const result = [];

        for (let id in this.dictionary) {
            const element = this.dictionary[id];
            result.push({
                id,
                isCompleted: element.isCompleted,
                description: element.description
            });

        }

        return result;
    }
}

module.exports = Repository;