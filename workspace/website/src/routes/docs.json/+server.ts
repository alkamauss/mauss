import { json } from '@sveltejs/kit';
import ts from 'typescript';
import { exports } from '$mauss/package.json';

export const prerender = true;

export interface Schema {
	[modules: string]: Array<{
		name: string;
		docs: string[];
		signature: string;
	}>;
}

export async function GET() {
	const program = ts.createProgram(
		Object.keys(exports).flatMap((m) => {
			if (m.slice(2).includes('.')) return [];
			return `../mauss/src/${m.slice(2) || 'core'}/index.ts`;
		}),
		{},
	);

	const schema: Schema = {};
	for (const exp in exports) {
		if (exp.slice(2).includes('.')) continue;
		const module = exp.slice(2) || 'core';
		const source = program.getSourceFile(`../mauss/src/${module}/index.ts`);
		if (!source) continue;

		const tc = program.getTypeChecker();
		schema[module] = [];

		ts.forEachChild(source, (node) => {
			if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
				const symbol = tc.getSymbolAtLocation(node.moduleSpecifier);
				if (!symbol) return;
				tc.getExportsOfModule(symbol).forEach((symbol) => {
					const decl = symbol.valueDeclaration || symbol.declarations?.[0];
					if (!decl || !ts.isFunctionDeclaration(decl)) return;

					schema[module].push({
						name: symbol.getName(),
						docs: parse.jsdoc(decl),
						get signature() {
							const signature = tc.getSignatureFromDeclaration(decl);
							if (!signature) return `function ${this.name}()`;
							return `function ${this.name}${tc.signatureToString(signature)}`;
						},
					});
				});
			} else if (
				ts.isFunctionDeclaration(node) &&
				node.name &&
				node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
			) {
				schema[module].push({
					name: node.name.text,
					docs: parse.jsdoc(node),
					get signature() {
						const signature = tc.getSignatureFromDeclaration(node);
						if (!signature) return `function ${this.name}()`;
						return `function ${this.name}${tc.signatureToString(signature)}`;
					},
				});
			}
		});
	}

	return json(schema);
}

const parse = {
	jsdoc(declaration: ts.FunctionDeclaration) {
		return ts.getJSDocCommentsAndTags(declaration).flatMap((doc) => {
			const lines = doc.getText().slice(1, -1).split('\n');
			const clean = lines.map((l) => l.replace(/^[\s*]+|[\s*]+$/g, ''));
			return clean.filter((l) => l);
		});
	},
};
