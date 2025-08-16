self.html = function (strings, ...values) {
	const template = document.createElement("template");
	const markers = [];
	function normalizeNodes(val) {
		if (val instanceof Node) {
			return [val]
		};
		if (val instanceof DocumentFragment) {
			return Array.from(val.childNodes)
		};
		if (val instanceof NodeList || val instanceof HTMLCollection) {
			return Array.from(val);
		}
		if (Array.isArray(val)) {
			return val.flatMap(normalizeNodes)
		};
		return [document.createTextNode(String(val))];
	}

	const htmlString = strings
		.map((str, i) => {
			const val = values[i];

			if (
				val instanceof Node ||
				val instanceof DocumentFragment ||
				val instanceof NodeList ||
				val instanceof HTMLCollection ||
				Array.isArray(val)
			) {
				const marker = `<!--_m_:${markers.length}-->`;
				const nodes = normalizeNodes(val).map((n) => n.cloneNode(true));
				markers.push(nodes);
				return str + marker;
			}
			if (val && typeof val === "object" && "subscribe" in val) {
				const container = document.createElement("span");
				val.subscribe((v) => {
					const nodes = normalizeNodes(v).map((n) => n.cloneNode(true));
					container.replaceChildren(...nodes);
				});
				const marker = `<!--_m_:${markers.length}-->`;
				markers.push([container]);
				return str + marker;
			}

			if (typeof val === "function") {
				const marker = `_mfn:${markers.length}`;
				markers.push(val);
				return str + marker;
			}

			return str + (val ?? "");
		})
		.join("");

	template.innerHTML = htmlString;
	const root = template.content;

	const replacements = [];
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
	while (walker.nextNode()) {
		const comment = walker.currentNode;
		const match = comment.nodeValue.match(/^_m_:(\d+)$/);
		if (match) {
			replacements.push({
				comment,
				nodes: markers[parseInt(match[1])],
			});
		}
	}

	for (const { comment, nodes } of replacements) {
		comment.replaceWith(...nodes);
	}

	root.querySelectorAll("*").forEach(el => {
	for (const attr of el.attributes) {
		if (attr.name.startsWith("on:") && attr.value.startsWith("_mfn:")) {
		const event = attr.name.slice(3);
		const index = Number(attr.value.slice(5));
		const handler = markers[index];
		if (typeof handler === "function") {
			el.addEventListener(event, handler);
		}
		el.removeAttribute(attr.name);
		}
	}
	});
	console.log(markers)
	return root;
};