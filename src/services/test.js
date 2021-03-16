/* eslint-disable max-classes-per-file */
var Juice = /** @class */ (function () {
    function Juice(options) {
        this.options = options;
    }
    Juice.prototype.leakSlowly = function () {
        if (this.options ? .banana : ) {
            return true;
        }
        return false;
    };
    Juice.prototype.leakQuickly = function () {
        if ('orange' in this.options) {
            return true;
        }
        return false;
    };
    return Juice;
}());
var OrangeJuice = /** @class */ (function () {
    function OrangeJuice() {
    }
    OrangeJuice.prototype.leakQuickly = function () {
        //
    };
    return OrangeJuice;
}());
// type Juice = BananaJuice | OrangeJuice;
//service
function factory(friut) {
    return new Juice(friut);
}
var orangeJuice = factory({ orange: true });
orangeJuice.leakQuickly();
// orangeJuice.leak();
var formations = {
    b: [
        {
            start: 0,
            end: 3
        },
        {
            start: 6,
            end: 8
        },
    ],
    i: [
        {
            start: 2,
            end: 6
        },
        {
            start: 7,
            end: 9
        },
    ]
};
var rootNodes = [{
        name: '',
        start: 0,
        end: 9,
        children: []
    }];
// nodes = [{b,1,10},{b,12,18}]
var insertInNodes = function (nodes, name, interval) {
    for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        if (interval.start < node.end && interval.end > node.start) {
            if (node.children.length === 0) {
                if (node.start < interval.start) {
                    node.children.push({
                        name: '',
                        start: node.start,
                        end: interval.start,
                        children: []
                    });
                }
                node.children.push({
                    name: name,
                    start: Math.max(node.start, interval.start),
                    end: Math.min(node.end, interval.end),
                    children: []
                });
                if (node.end < interval.end) {
                    node.children.push({
                        name: '',
                        start: interval.end,
                        end: node.end,
                        children: []
                    });
                }
            }
            else {
                insertInNodes(node.children, name, interval);
            }
        }
    }
};
Object.entries(formations).forEach(function (_a) {
    var name = _a[0], intervals = _a[1];
    intervals.forEach(function (interval) {
        insertInNodes(rootNodes, name, interval);
    });
});
console.log(rootNodes);
