(function () {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };

    // https://dom.spec.whatwg.org/#dom-childnode-before
    Element.prototype.before =
        Text.prototype.before =
        Comment.prototype.before =
            function () {
                const parent = this.parentNode;
                if (!parent) return;

                const nodes = Array.from(arguments);

                // Let viablePreviousSibling be this’s first preceding sibling
                // not in nodes; otherwise null.
                for (
                    var viablePreviousSibling = this.previousSibling;
                    viablePreviousSibling != null &&
                    nodes.indexOf(viablePreviousSibling) >= 0;
                    viablePreviousSibling =
                        viablePreviousSibling.previousSibling
                );

                // If viablePreviousSibling is null, then set it to parent’s
                // first child; otherwise to viablePreviousSibling’s next
                // sibling.
                if (viablePreviousSibling === null) {
                    viablePreviousSibling = parent.firstChild;
                } else {
                    viablePreviousSibling = viablePreviousSibling.nextSibling;
                }

                // Pre-insert node into parent before viablePreviousSibling.
                parent.insertBefore(nodesToNode(nodes), viablePreviousSibling);
            };

    // https://dom.spec.whatwg.org/#dom-childnode-after
    Element.prototype.after =
        Text.prototype.after =
        Comment.prototype.after =
            function () {
                const parent = this.parentNode;
                if (!parent) return;

                const nodes = Array.from(arguments);
                const viableNextSibling = findViableNextSibling(this, nodes);

                // Let node be the result of converting nodes into a node, given
                // nodes and this’s node document.
                // Pre-insert node into parent before viableNextSibling.
                parent.insertBefore(nodesToNode(nodes), viableNextSibling);
            };

    // https://dom.spec.whatwg.org/#dom-childnode-replacewith
    Element.prototype.replaceWith =
        Text.prototype.replaceWith =
        Comment.prototype.replaceWith =
            function () {
                const parent = this.parentNode;
                if (!parent) return;

                const nodes = Array.from(arguments);
                const viableNextSibling = findViableNextSibling(this, nodes);

                // Let node be the result of converting nodes into a node, given
                // nodes and this’s node document.
                const node = nodesToNode(nodes);
                // If this’s parent is parent, replace this with node within parent.
                // NOTE: 'this' could have been inserted into node.
                // Otherwise, pre-insert node into parent before viableNextSibling.
                if (this.parentNode === parent) {
                    parent.removeChild(this);
                }

                parent.insertBefore(node, viableNextSibling);
            };

    // https://dom.spec.whatwg.org/#dom-childnode-remove
    Element.prototype.remove =
        Text.prototype.remove =
        Comment.prototype.remove =
            function () {
                const parent = this.parentNode;
                if (!parent) return;

                parent.removeChild(this);
            };

    // https://dom.spec.whatwg.org/#dom-parentnode-append
    Element.prototype.append = function () {
        const node = nodesToNode(Array.from(arguments));
        this.appendChild(node);
    };

    // https://dom.spec.whatwg.org/#converting-nodes-into-a-node
    function nodesToNode(nodes) {
        if (nodes.length === 1) {
            return stringToTextNode(nodes[0]);
        }

        let fragment = document.createDocumentFragment();
        for (let node of nodes) {
            fragment.appendChild(stringToTextNode(node));
        }
        return fragment;
    }

    // TODO: Better name
    function stringToTextNode(node) {
        if (typeof node === "string" || node instanceof String) {
            return document.createTextNode(node);
        }
        return node;
    }

    function findViableNextSibling(node, nodes) {
        // Let viableNextSibling be this’s first following sibling not in nodes;
        // otherwise null.
        for (
            var viableNextSibling = node.nextSibling;
            viableNextSibling != null && nodes.indexOf(viableNextSibling) >= 0;
            viableNextSibling = viableNextSibling.nextSibling
        );
        return viableNextSibling;
    }
})();
