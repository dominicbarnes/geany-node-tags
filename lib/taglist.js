function TagList() {
    this.list = [];
}

TagList.prototype.add = function (name, ret, sig, desc) {
    this.list.push([
        name,
        ret  || "",
        sig  || "",
        desc || ""
    ]);
};

TagList.prototype.render = function () {
    var output = this.list.map(function (tag) {
        return tag.join("|");
    });

    return ["# format=pipe"].concat(output).join("\n");
}

module.exports = TagList;
