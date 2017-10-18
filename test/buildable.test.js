"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Buildable = /** @class */ (function () {
    function Buildable() {
    }
    Buildable.prototype.builder = function () {
        return new Builder();
    };
    Buildable.prototype.cloneBuilder = function () {
        return this.builder().withBuildable(this);
    };
    return Buildable;
}());
exports.Buildable = Buildable;
var Builder = /** @class */ (function () {
    function Builder() {
        this.buildable = new Buildable();
    }
    Builder.prototype.withA = function (a) {
        this.buildable.a = a;
        return this;
    };
    Builder.prototype.withB = function (b) {
        this.buildable.b = b;
        return this;
    };
    Builder.prototype.withC = function (c) {
        this.buildable.c = c;
        return this;
    };
    Builder.prototype.withBuildable = function (buildable) {
        if (buildable != undefined) {
            return this
                .withA(buildable.a)
                .withB(buildable.b)
                .withC(buildable.c);
        }
        else {
            return this;
        }
    };
    Builder.prototype.build = function () {
        return this.buildable;
    };
    return Builder;
}());
exports.Builder = Builder;
describe('Test buildable', function () {
    it('Clone builder should clone an object without mutations', function () {
        // Setup
        var obj1 = new Buildable();
        obj1.a = "a";
        obj1.b = "b";
        obj1.c = "c";
        // When
        var obj2 = obj1.cloneBuilder().build();
        // Then
        expect(obj2.a).toBe(obj1.a);
        expect(obj2.b).toBe(obj1.b);
        expect(obj2.c).toBe(obj1.c);
        expect(obj2).toEqual(obj1);
    });
});
//# sourceMappingURL=buildable.test.js.map