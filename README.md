# geany-node-tags

This mini project is a simple script that downloads a specified version of the
[Node.js API Docs](http://api.nodejs.org/) (in their JSON format) and generates
a .tags file compatible with [Geany](http://geany.org/).

## Quick Installation (from the repo)

Navigate to the version you are looking for (if it has already been generated)
in the `dist` directory. Open the "raw" format, and download that file
to `$HOME/.config/geany/tags/node.js.tags`. (leave out the version number)

## Advanced Installation

    git clone git@github.com:dominicbarnes/geany-node-tags.git
    cd geany-node-tags
    make

The `make` command will create and install from the node version corresponding
to `node -v` on your system. To override the version, simply pass `VERSION=[blah]`
to the make command, for example:

    make install VERSION=0.9.0

## Adding more node.js versions

Create an issue on Github with your request, or you can do it yourself by
forking the repo, and running:

    make tags VERSION=0.9.0

This will create the corresponding tags file in the `dist` directory. From
there, submit a Pull Request with your new version(s).
