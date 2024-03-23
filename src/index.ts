import FetchHandler from "./Modules/fetchHandler.js";

class WrapBlox {
	
	fetchUser = async (userId : number) => {
		return await FetchHandler.fetch('GET', 'Users', `/users/${userId}`);
	}
}


export default WrapBlox;