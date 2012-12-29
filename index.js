var fs = require("fs"),
    http = require("http"),
    path = require("path"),
    async = require("async"),
    traverse = require("traverse"),
    TagList = require("./lib/taglist"),
    version = process.argv[2],
    tags = new TagList(),
    url, input;

if (version.charAt(0) !== "v") {
    version = "v" + version;
}

url = "http://nodejs.org/docs/" + version + "/api/all.json";
input = path.join(__dirname, "tmp", version + ".json");

async.waterfall([
    // tmp directory
    function (done) {
        var dir = path.dirname(input);

        fs.exists(dir, function (exists) {
            if (exists) return done();

            fs.mkdir(dir, done);
        });
    },
    // download api documentation
    function (done) {
        fs.exists(input, function (exists) {
            if (exists) return done();

            http.get(url, function (res) {
                if (res.statusCode !== 200) {
                    return done(new Error("failed to download: " + url));
                }

                res.pipe(fs.createWriteStream(input));
                res.on("end", done);
            });
        });
    },
    // read/parse api documentation
    function (done) {
        fs.readFile(input, function (err, json) {
            if (err) return done(err);

            try {
                done(null, JSON.parse(json));
            } catch (e) {
                done(e);
            }
        });
    },
    // traverse docs for relevant data
    function (docs, done) {
        traverse(docs).forEach(function () {
            if (this.isRoot) return;

            // need to see if I can figure out why this is, but the node docs
            // have duplicated information in their "signatures" ... the 2nd
            // index of the array is always a "stripped down" version of the
            // first... *sigh*
            if (this.key === "0" && this.parent.key === "signatures") {
                signature(this);
            }
        });

        process.nextTick(done);
    }
], function (err) {
    if (err) return console.error(err);

    console.log(tags.render());
});

function signature(sig) {
    var method = sig.parent.parent,
        cls = method.parent.parent,
        params = method.node.textRaw.match(/\(.*\)$/),
        ret = sig.node["return"],
        className;

    if (!params) {
        params = "";
    } else if (ret && ret.type) {
        params += ": " + ret.type;
    }

    if (!cls || !cls.node.name) {
        className = null;
    } else if (cls.node.name === "timers") {
        return;
    } else if (cls.node.type === "misc") {
        className = null;
    } else if (cls.node.type === "class") {
        className = cls.node.name + "#";
    } else {
        className = cls.node.name + ".";
    }

    tags.add(method.node.name, className, params);
}
