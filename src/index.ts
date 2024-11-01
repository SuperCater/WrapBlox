import FetchHandler from "./Classes/Internal/fetchHandler.js";
import Badge from "./Classes/Badge.js";
import Group from "./Classes/Group.js";
import Place from "./Classes/Place.js";
import Universe from "./Classes/Universe.js";
import User from "./Classes/User.js";
import AuthedUser from "./Classes/AuthedUser.js";

import { RawGroupData } from "./Types/GroupTypes.js";
import { RawBadgeData } from "./Types/BadgeTypes.js";
import { RawUniverseData } from "./Types/UniverseTypes.js";
import { RawUserData } from "./Types/UserTypes.js";

//export { Badge, Group, Place, Universe, User };

export type * from "./Types/BaseTypes.js";
export type * from "./Types/BadgeTypes.js";
export type * from "./Types/GroupTypes.js";
export type * from "./Types/InventoryTypes.js";
export type * from "./Types/PlaceTypes.js";
export type * from "./Types/UniverseTypes.js";
export type * from "./Types/UserTypes.js";
export * from "./Types/Enums.js";

export default class WrapBlox {
	fetchHandler : FetchHandler;
	self : AuthedUser | null = null;
	
	constructor() {
		this.fetchHandler = new FetchHandler();
	}
	
	/**
	 * Authenticates a user using the provided cookie.
	 * Note that the cookie should be unmodified,
	 * it should contain the `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_` at the start.
	 *
	 * @param cookie - The authentication cookie.
	 * @returns A promise that resolves to an instance of `AuthedUser` representing the authenticated user.
	 */
	login = async (cookie : string) => {
		this.fetchHandler.setCredential("cookie", cookie);
		
		const userInfo = await this.fetchHandler.fetchLegacyAPI('GET', 'Users', '/users/authenticated');
		const realUserData = await this.fetchRawUser(userInfo.id);
		this.self = new AuthedUser(this, realUserData, cookie);
		return this.self;
	}

	fetchAuthedUser = async (cookie : string) => {
		const userInfo = await this.fetchHandler.fetchLegacyAPI('GET', 'Users', '/users/authenticated', {cookie});
		const realUserData = await this.fetchRawUser(userInfo.id);
		return new AuthedUser(this, realUserData, cookie);
	}

	
	/**
	 * Checks if the user is logged in.
	 *
	 * @returns {this is {self: AuthedUser}} Returns true if `self` is not null, indicating the user is authenticated.
	 */
	isLoggedIn = () : this is {self : AuthedUser} => {
		return this.self !== null;
	}
	
	//? Users

	/**
	 * Fetches raw user data based on the provided query.
	 * 
	 * @param query - The query to search for the user, which can be a string (username) or a number (Id).
	 * @param useCache - Optional parameter to determine whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a User object.
	 * @throws Will throw an error if no results are found when searching by user name.
	 */
	private fetchRawUser = async (query : string | number, useCache = true) : Promise<RawUserData> => {
		if (typeof(query) === "number") {
			return await this.fetchHandler.fetchLegacyAPI('GET', 'Users', `/users/${query}`, { useCache: useCache });
		}

		const userId = (await this.fetchHandler.fetchLegacyAPI("POST", "Users", "/usernames/users", {
			useCache: useCache,
			body: {
				usernames: [query],
				excludeBannedUsers: false
			}
		})).data[0]?.id;
		if (!userId) throw new Error("User not found");

		return await this.fetchRawUser(userId, useCache);
	}
	

	/**
	 * Fetches a user based on the provided query.
	 * 
	 * @param query - The query to search for the user, which can be a string (username) or a number (Id).
	 * @param useCache - Optional parameter to determine whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a User object.
	 * @throws Will throw an error if the user is not found.
	 */
	fetchUser = async (query : string | number, useCache = true): Promise<User> => {
		const rawData = await this.fetchRawUser(query, useCache);
		if (!rawData) throw new Error("User not found");

		return new User(this, rawData);
	}

	//? Badges

	/**
	 * Fetches a raw data of a badge by its Id.
	 *
	 * @param badgeId - The ID of the badge to fetch.
	 * @param useCache - A boolean indicating whether to use the cache. Defaults to true.
	 * @returns A promise that resolves to a `Badge` object.
	 * @throws Will throw an error if the badge is not found.
	 */
	private fetchRawBadge = async (badgeId: number, useCache = true): Promise<RawBadgeData> => {
		return await this.fetchHandler.fetchLegacyAPI("GET", "Badges", `/badges/${badgeId}`, { useCache: useCache });
	};

	/**
	 * Fetches a badge by its Id.
	 *
	 * @param badgeId - The ID of the badge to fetch.
	 * @param useCache - A boolean indicating whether to use the cache. Defaults to true.
	 * @returns A promise that resolves to a `Badge` object.
	 * @throws Will throw an error if the badge is not found.
	 */
	fetchBadge = async (badgeId: number, useCache = true): Promise<Badge> => {
		const rawData = await this.fetchRawBadge(badgeId, useCache);
		if (!rawData) throw new Error("Badge not found");

		return new Badge(this, rawData);
	};

	//? Groups

	/**
	 * Fetches raw group data based on a query which can be either a group name or a group ID.
	 * If a group name is provided, it will first look up the group Id and then fetch the group data.
	 * It is recommended to use the group Id over the name.
	 * 
	 * @param query - The group name (string) or group Id (number) to search for.
	 * @param useCache - Optional boolean to indicate whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to the raw group data.
	 * @throws Will throw an error if no results are found when searching by group name.
	 */
	private fetchRawGroup = async (query: string | number, useCache = true): Promise<RawGroupData> => {
		if (typeof(query) === "number") {
			return (await this.fetchHandler.fetchLegacyAPI("GET", "GroupsV2", "/groups", {
				useCache: useCache,
				params: {
					groupIds: [query]
				}
			})).data[0];
		}

		const groupId = (await this.fetchHandler.fetchLegacyAPI("GET", "Groups", "/groups/search/lookup", {
			useCache: useCache,
			params: {
				groupName: query
			}
		}))?.data[0]?.id;

		if (!groupId) throw new Error("No results found");

		return await this.fetchRawGroup(groupId, useCache);
	};

	/**
	 * Fetches a group based on the provided query.
	 * If a group name is provided, it will first look up the group Id and then fetch the group data.
	 * It is recommended to use the group Id over the name.
	 * 
	 * @param query - The group name (string) or group Id (number) to search for.
	 * @param useCache - Optional boolean to indicate whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to a `Group` object.
	 * @throws Will throw an error if the group is not found.
	 */
	fetchGroup = async (query: string | number, useCache = true): Promise<Group> => {
		const rawData = await this.fetchRawGroup(query, useCache);
		if (!rawData) throw new Error("Group not found");

		return new Group(this, rawData);
	};

	//? Universes
	
	/**
	 * Fetches raw universe data for a given universe Id.
	 *
	 * @param universeId - The Id of the universe to fetch data for.
	 * @param useCache - Optional. Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to the raw universe data.
	 */
	private fetchRawUniverse = async (universeId: number, useCache = true) : Promise<RawUniverseData> => {
		return (await this.fetchHandler.fetchLegacyAPI('GET', 'Games', "/games", {
			useCache: useCache,
			params: {
				universeIds: [universeId]
			}
		})).data[0];
	};

	/**
	 * Fetches the universe data for a given universe Id.
	 *
	 * @param universeId - The Id of the universe to fetch.
	 * @param useCache - Optional. Whether to use cached data if available. Defaults to true.
	 * @returns A promise that resolves to a `Universe` object.
	 * @throws Will throw an error if the universe is not found.
	 */
	fetchUniverse = async (universeId: number, useCache = true): Promise<Universe> => {
		const rawData = await this.fetchRawUniverse(universeId, useCache);
		if (!rawData) throw new Error("Universe not found");

		return new Universe(this, rawData);
	};

	//? Places

	/**
	 * Fetches raw place details for a given place Id.
	 *
	 * @param placeId - The Id of the place to fetch details for.
	 * @param useCache - Optional. Whether to use cached data. Defaults to true.
	 * @returns A promise that resolves to the raw place details.
	 */
	private fetchRawPlace = async (placeId: number, useCache = true) => {
		return (await this.fetchHandler.fetchLegacyAPI("GET", "Games", "/games/multiget-place-details", {
			useCache: useCache,
			params: {
				placeIds: [placeId]
			}
		}))[0];
	};

	/**
	 * Fetches a place by its Id and returns a Place object.
	 * 
	 * @param placeId - The Id of the place to fetch.
	 * @param useCache - Optional. Whether to use cached data if available. Defaults to true.
	 * @returns A Promise that resolves to a Place object.
	 * @throws Will throw an error if the place is not found.
	 */
	fetchPlace = async (placeId: number, useCache = true) => {
		const rawData = await this.fetchRawPlace(placeId, useCache);
		if (!rawData) throw new Error("Place not found");

		return new Place(this, rawData);
	};
};