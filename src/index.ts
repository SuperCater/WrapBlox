import Group from "./Classes/Group.js";
import User from "./Classes/User.js";
import FetchHandler from "./Modules/fetchHandler.js";
import { RawGroupData } from "./Types/GroupTypes.js";
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
	/**
	 * Get the raw data of a group
	 * @param groupId The ID of the group to fetch
	 * @returns The raw data of the group
	 */
	fetchRawGroup = async (groupId : number) : Promise<RawGroupData> => {
		return await FetchHandler.fetch('GET', 'Groups', `/groups/${groupId}`);
	}
	
	/**
	 * Get the group object of a group
	 * @param groupId The ID of the group to fetch
	 * @returns The group object
	 */
	fetchGroup = async (groupId : number) => {
		const rawData = await this.fetchRawGroup(groupId);
		return new Group(this, rawData);
	}
	
}


export default WrapBlox;