import User from "./Classes/User.js";
import FetchHandler from "./Modules/fetchHandler.js";
import { RawUserData } from "./Types/UserTypes.js";

class WrapBlox {
	/**
	 * Get the raw data of a user
	 * @param userId The ID of the user to fetch
	 * @returns The raw data of the user
	 */
	fetchRawUser = async (userId : number) : Promise<RawUserData> => {
		return await FetchHandler.fetch('GET', 'Users', `/users/${userId}`);
	}
	
	/**
	 * Gets the user object of a user
	 * @param userId The ID of the user to fetch
	 * @returns The user object
	 */
	fetchUser = async (userId : number) => {
		const rawData = await this.fetchRawUser(userId);
		return new User(rawData);
	}
}


export default WrapBlox;