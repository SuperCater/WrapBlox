import Group from "./Classes/Group.js";
import User from "./Classes/User.js";
import FetchHandler from "./Classes/Internal/fetchHandler.js";
import { APIGroupLookup, RawGroupData } from "./Types/GroupTypes.js";
import { APIUserLookup, RawUserData } from "./Types/UserTypes.js";
import Member from "./Classes/Member.js";
import Role from "./Classes/Role.js";
import AuthedUser from "./Classes/AuthedUser.js";
import { APIGameData } from "./Types/GameTypes.js";
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
	 * Checks if the client is logged in
	 * @returns {boolean} Whether the client is logged in
	 */
	isLoggedIn = () : this is {self : AuthedUser} => {
		return this.self !== null;
	}

	/**
	 * Gets the universeId of a place
	 * @param {number} placeId - The Id of the place to get the universeId of 
	 * @returns {Promise<number>} The universeId of the place
	 */
	PlaceIdToUniverseId = async (placeId : number) : Promise<number> => {
		return await this.fetchHandler.fetch('GET', 'API', `/universes/v1/places/${placeId}/universe`);
	}
	
	/**
	 * Get the raw data of a user
	 * @param userId - The Id of the user to fetch
	 * @returns {Promise<RawUserData>} The raw data of the user
	 */
	fetchRawUser = async (userId : number, usecache = true) : Promise<RawUserData> => {
		return await this.fetchHandler.fetch('GET', 'Users', `/users/${userId}`, {usecache});
	}
	
	/**
	 * Gets the user object of a user
	 * @param {number} userId - The ID of the user to fetch
	 * @returns {Promise<User>} The user object
	 */
	fetchUser = async (userId : number, usecache = true): Promise<User> => {
		const rawData = await this.fetchRawUser(userId, usecache);
		return new User(this, rawData);
	}

	/**
	 * Get the user object of a user by their username
	 * @param {string} username - The username of the user to fetch
	 * @throws {Error} User not found - The user was not found
	 * @returns {Promise<User>} The user object
	 */
	fetchUserByName = async (username : string, usecache = true): Promise<User> => {
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
	 * @param {number} groupId - The ID of the group to fetch
	 * @returns {Promise<RawGroupData>} The raw data of the group
	 */
	fetchRawGroup = async (groupId : number, usecache = true) : Promise<RawGroupData> => {
		return await this.fetchHandler.fetch('GET', 'Groups', `/groups/${groupId}`, {usecache});
	}
	
	/**
	 * Get the group object of a group
	 * @param {number} groupId - The ID of the group to fetch
	 * @returns {Promise<Group>} - The group object
	 */
	fetchGroup = async (groupId : number, usecache = true): Promise<Group> => {
		const rawData = await this.fetchRawGroup(groupId, usecache);
		return new Group(this, rawData);
	}
	
	/**
	 * Logs in with a cookie, and sets the client's self to the logged in user
	 * @param {string} cookie - The cookie to log in with (including _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_)
	 * @throws {Error} Invalid cookie - The cookie is invalid
	 * @returns {Promise<User>} The user object of the logged in user
	 */
	login = async (cookie : string): Promise<User> => {
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
	
	/**
	 * Fetches the raw data of a game
	 * @param {number} universeID - The Id of the universe to fetch
	 * @returns {Promise<APIGameData>} The raw data of the game
	 */
	fetchRawGame = async (universeID : number) : Promise<APIGameData> => {
		return (await this.fetchHandler.fetch('GET', 'Games', "/games", {
			params: {
				universeIds: [universeID]
			}
		})).data[0];
	}
	
	/**
	 * Fetches the game object of a game
	 * @param {number} universeID - The Id of the universe to fetch
	 * @returns {Promise<Game>} The game object
	 */
	fetchGame = async (universeID : number) => {
		const rawData = await this.fetchRawGame(universeID);
		return new Game(this, rawData);
	}
	
	/**
	 * Fetches the group object of a group by its name
	 * @param {string} query - The query of the group to fetch
	 * @returns {Promise<Group>} The group object
	 */
	searchGroups =  async (query : string) : Promise<APIGroupLookup[]> => {
		const rawData = (await this.fetchHandler.fetch('GET', 'Groups', "/groups/search/lookup", {params: {groupName : query}})).data;
		return rawData
	}
	
	/**
	 * 
	 * @param {string} query - The query of the user to search 
	 * @param {number} limit - Max amount of users to return (default 10)
	 * @returns {Promise<APIUserLookup[]>} An array of users
	 */
	searchUsers = async(query : string, limit : number = 10): Promise<APIUserLookup[]> => {
		const rawData = (await this.fetchHandler.fetch('GET', 'Users', "/users/search", {params: {keyword : query, limit}})).data;
		return rawData;
	}
}


export default WrapBlox;