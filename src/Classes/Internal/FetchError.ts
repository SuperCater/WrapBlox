export default class FetchError extends Error {
	response : Response;

	constructor(message : string, response : Response) {
		super(message);
		this.response = response;
	};

	async format(): Promise<string> {
		const body = await this.response.json();
		const formattedErrors = body.errors.map((error: {code: number, message: string}) => `[${error.code}]: ${error.message}`).join("\n");

		return `[${this.response.status} ${this.response.statusText}]:\n${formattedErrors}`;
	};
};