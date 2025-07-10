import type { Rules } from './index.js';

export interface Issue {
	expected: 'definition' | 'object' | keyof Rules;
	path: string[];
	message: string;
}

export class Rejection extends Error {
	constructor(public issues: Issue[]) {
		super(`[Rejected] ${issues.length} issue(s) found`);
		this.name = 'Rejection';
	}
}
