self.css = (() => {
	// id gets bumped for a new class
	let id = 0;
	const styleCache = new Map();

	const styleTag = document.createElement("style");
	document.head.append(styleTag);

	return (strings, ...values) => {
		const raw = String.raw(strings, ...values).trim();
		if (styleCache.has(raw)) return styleCache.get(raw);

		const className = `_m${id++}`;
		const lines = raw
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);

		const topLevelProps = [];
		const extraBlocks = [];

		let braceDepth = 0;
		let buffer = [];

		for (let line of lines) {
			// replace & and __class__ with the actual classname
			line = line.replace(/&|\.__class__\b/g, `.${className}`);

			if (line.includes("{")) {
				braceDepth += (line.match(/{/g) || []).length;
			}

			if (braceDepth > 0) {
				buffer.push(line);

				if (line.includes("}")) {
					braceDepth -= (line.match(/}/g) || []).length;
					if (braceDepth === 0) {
						extraBlocks.push(buffer.join(""));
						buffer = [];
					}
				}

				continue;
			}

			if (!line.includes("{") && !line.includes("}")) {
				topLevelProps.push(line);
			}
		}

		let result = "";
		if (topLevelProps.length) {
			result += `.${className}{${topLevelProps.join(";")}}`;
		}
		if (extraBlocks.length) {
			result += extraBlocks.join("");
		}

		styleTag.textContent += result.trim();

		styleCache.set(raw, className);
		return className;
	};
})();