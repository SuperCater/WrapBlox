import Group from "./Classes/Group.js";
import User from "./Classes/User.js";
import FetchHandler from "./Classes/Internal/fetchHandler.js";
import { RawGroupData } from "./Types/GroupTypes.js";
import { RawUserData } from "./Types/UserTypes.js";
import Member from "./Classes/Member.js";
import Role from "./Classes/Role.js";
import AuthedUser from "./Classes/AuthedUser.js";
import { APIGameData } from "./Types/GameTypes.js";
import Game from "./Classes/Game.js";

export { Member, Group, User, Role}

export type * from "./Types/BaseTypes.js";
export type * from "./Types/GroupTypes.js";
export type * from "./Types/UserTypes.js";

class WrapBlox {
	fetchHandler : FetchHandler;
	self : User | null = null;
	
	
	constructor(cookie? : string) {
		this.fetchHandler = new FetchHandler(cookie);
	}
	
	/**
	 * Get the raw data of a user
	 * @param userId The ID of the user to fetch
	 * @returns The raw data of the user
	 */
	fetchRawUser = async (userId : number) : Promise<RawUserData> => {
		return await this.fetchHandler.fetch('GET', 'Users', `/users/${userId}`);
	}
	
	/**
	 * Gets the user object of a user
	 * @param userId The ID of the user to fetch
	 * @returns The user object
	 */
	fetchUser = async (userId : number) => {
		const rawData = await this.fetchRawUser(userId);
		return new User(this, rawData);
	}
	/**
	 * Get the user object of a user by their username
	 * @param username The username of the user to fetch
	 * @returns The user object
	 */
	fetchUserByName = async (username : string) => {
		const rawData = (await this.fetchHandler.fetch('POST', 'Users', "/usernames/users", undefined, {usernames: [username]})).data[0];
		if (!rawData) throw new Error("User not found");
		return await this.fetchUser(rawData.id);
	}
	/**
	 * Get the raw data of a group
	 * @param groupId The ID of the group to fetch
	 * @returns The raw data of the group
	 */
	fetchRawGroup = async (groupId : number) : Promise<RawGroupData> => {
		return await this.fetchHandler.fetch('GET', 'Groups', `/groups/${groupId}`);
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
	
	/**
	 * Logs in with a cookie
	 * @param cookie The cookie to log in with
	 * @returns The user object of the logged in user
	 */
	
	login = async (cookie : string) => {
		this.fetchHandler.cookie = cookie;
		const userInfo = await this.fetchHandler.fetch('GET', 'Users', '/authenticated/user');
		const realUserData = await this.fetchRawUser(userInfo.id);
		this.self = new AuthedUser(this, realUserData);
		return this.self;
	}
	
	fetchRawGame = async (universeID : number) : Promise<APIGameData> => {
		return (await this.fetchHandler.fetch('GET', 'Games', "/games", {
			universeIds: [universeID]
		})).data[0];
	}
	
	fetchGame = async (universeID : number) => {
		const rawData = await this.fetchRawGame(universeID);
		return new Game(this, rawData);
	}
	
}


export default WrapBlox;