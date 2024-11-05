export type FetchedError = {
	code: number,
	message: string
};

export default class FetchError extends Error {
	response : Response;

	constructor(message : string, response : Response) {
		super(message);
		this.response = response;
	};

	async getErrors(): Promise<FetchedError[]> {
		const body = await this.response.json();
		return body.errors;
	};

	async format(): Promise<string> {
		const errors = await this.getErrors();
		const formattedErrors = errors.map((error: {code: number, message: string}) => `[${error.code}]: ${error.message}`).join("\n");

		return `[${this.response.status} ${this.response.statusText}]:\n${formattedErrors}`;
	};
};