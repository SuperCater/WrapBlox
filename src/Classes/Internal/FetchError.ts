export default class FetchError extends Error {
	code : number;
	response : Response;
	constructor(message : string, code : number, response : Response) {
		super(message);
		this.code = code;
		this.response = response;
	}
}