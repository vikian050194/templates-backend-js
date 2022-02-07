const assert = require("assert");

describe("Foo", function () {
    it("Bar", function () {
        const a = "33";
        const b = "42";

        assert.equal(a, b, "message");
    });
});