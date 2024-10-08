import Group from "./Classes/Group.js";
import User from "./Classes/User.js";
import FetchHandler from "./Classes/Internal/fetchHandler.js";
import type { APIGroupLookup, RawGroupData } from "./Types/GroupTypes.js";
import type { APIUserLookup, RawUserData } from "./Types/UserTypes.js";
import Member from "./Classes/Member.js";
import Role from "./Classes/Role.js";
import AuthedUser from "./Classes/AuthedUser.js";
import type { APIGameData } from "./Types/GameTypes.js";
import Game from "./Classes/Game.js";

export { Member, Group, User, Role}

export type * from "./Types/BaseTypes.js";
export type * from "./Types/GroupTypes.js";
export type * from "./Types/UserTypes.js";
export type * from "./Types/GameTypes.js";
export type * from "./Types/BadgeTypes.js"
export type * from "./Types/InventoryTypes.js";
export * from "./Types/Enums.js";


class WrapBlox {
	fetchHandler : FetchHandler;
	self : AuthedUser | null = null;
	
	
	constructor() {
		this.fetchHandler = new FetchHandler();
	}
	
	/**
	 * 
	 */
	
	isLoggedIn = () : this is {self : AuthedUser} => {
		return this.self !== null;
	}
	
	/**
	 * Get the raw data of a user
	 * @param userId The ID of the user to fetch
	 * @returns The raw data of the user
	 */
	fetchRawUser = async (userId : number, usecache = true) : Promise<RawUserData> => {
		return await this.fetchHandler.fetch('GET', 'Users', `/users/${userId}`, {usecache});
	}
	
	/**
	 * Gets the user object of a user
	 * @param userId The ID of the user to fetch
	 * @returns The user object
	 */
	fetchUser = async (userId : number, usecache = true) => {
		const rawData = await this.fetchRawUser(userId, usecache);
		return new User(this, rawData);
	}
	/**
	 * Get the user object of a user by their username
	 * @param username The username of the user to fetch
	 * @returns The user object
	 */
	fetchUserByName = async (username : string, usecache = true) => {
		// const rawData = (await this.fetchHandler.fetch('POST', 'Users', "/usernames/users", undefined, {usernames: [username]})).data[0];
		const rawData = (await this.fetchHandler.fetch("POST", "Users", "/usernames/users", {
			body: {
				usernames: [username]
			}
		})).data[0];
		if (!rawData) throw new Error("User not found");
		return await this.fetchUser(rawData.id, usecache);
	}
	/**
	 * Get the raw data of a group
	 * @param groupId The ID of the group to fetch
	 * @returns The raw data of the group
	 */
	fetchRawGroup = async (groupId : number, usecache = true) : Promise<RawGroupData> => {
		return await this.fetchHandler.fetch('GET', 'Groups', `/groups/${groupId}`, {usecache});
	}
	
	/**
	 * Get the group object of a group
	 * @param groupId The ID of the group to fetch
	 * @returns The group object
	 */
	fetchGroup = async (groupId : number, usecache = true) => {
		const rawData = await this.fetchRawGroup(groupId, usecache);
		return new Group(this, rawData);
	}
	
	/**
	 * Logs in with a cookie, and sets the client's self to the logged in user
	 * @param cookie The cookie to log in with
	 * @returns The user object of the logged in user
	 */
	
	login = async (cookie : string) => {
		this.fetchHandler.cookie = cookie;
		const userInfo = await this.fetchHandler.fetch('GET', 'Users', '/users/authenticated');
		const realUserData = await this.fetchRawUser(userInfo.id);
		this.self = new AuthedUser(this, realUserData, cookie);
		return this.self;
	}
	
	/**
	 * Similar to login, but does not set the client's self to the logged in user
	 * @param cookie The cookie to log in with
	 * @returns The user object of the logged in user
	 */
	fetchAuthedUser = async (cookie : string) => {
		const userInfo = await this.fetchHandler.fetch('GET', 'Users', '/users/authenticated', {cookie});
		const realUserData = await this.fetchRawUser(userInfo.id);
		return new AuthedUser(this, realUserData, cookie);
	}
	
	fetchRawGame = async (universeID : number) : Promise<APIGameData> => {
		return (await this.fetchHandler.fetch('GET', 'Games', "/games", {
			params: {
				universeIds: [universeID]
			}
		})).data[0];
	}
	
	fetchGame = async (universeID : number) => {
		const rawData = await this.fetchRawGame(universeID);
		return new Game(this, rawData);
	}
	
	
	searchGroups =  async (query : string) : Promise<APIGroupLookup[]> => {
		const rawData = (await this.fetchHandler.fetch('GET', 'Groups', "/groups/search/lookup", {params: {groupName : query}})).data;
		return rawData
	}
	
	searchUsers = async(query : string, limit = 10): Promise<APIUserLookup[]> => {
		const rawData = (await this.fetchHandler.fetch('GET', 'Users', "/users/search", {params: {keyword : query, limit}})).data;
		return rawData;
	}
}


export default WrapBlox;