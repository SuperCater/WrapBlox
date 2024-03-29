import { RequestResponse } from "./types/bases.js";
import { ActionTypes, AuditLogs, FriendGroup, Group, GroupMetadata, GroupNameHistory, GroupRole, GroupRoleMembers, GroupRoles, GroupSettings, JoinRequest, JoinRequests, PartialGroup, PayoutPercentages, Role, RoleGroups, SelfGroupMetadata, SelfMembership, WallPosts } from "./types/groups.js";
import { Body, Endpoints, Methods, Params, SortOrder, WrapBloxOptions } from "./types/misc.js";
import { PartialUser, RequestedIDUser, RequestedUser, SearchUsers, SelfUser, User, UserNameHistory } from "./types/users.js";

/*
	* WrapBlox Feature support
	
	* User features
		* Get user
		* Get username history
		* Search users
		* Get user from username
*/


/**
 * 
 * @param {string} cookie The cookie to use (optional)
 * @param {string} apiKey The API key to use (optional)
 * @param {WrapBloxOptions} options The options to use for wrapblox (optional)
 * @example const wrapblox = new WrapBlox("cookie", "apiKey", {debugMode: true})
 */

class WrapBlox {
	constructor(cookie?: string, apiKey?: string, options?: WrapBloxOptions) {
		this.cookie = cookie;
		this.apiKey = apiKey;

		if (options) {
			if (typeof options.debugMode === "boolean") this.settings.debugMode = options.debugMode;
			if (typeof options.useErrors === "boolean") this.settings.useErrors = options.useErrors;
		}

		if (this.settings.debugMode) console.warn("[WrapBlox] Debugmode enabled - this will log stuff from wrapblox to the console");
	}

	settings = {
		debugMode: false,
		useErrors: false,
	}

	// Properties
	baseURLs = {
		users: "https://users.roblox.com/v1/",
		groups: "https://groups.roblox.com/v1/",
		groups2: "https://groups.roblox.com/v2/",
	}
	cookie?: string;
	apiKey?: string;

	// Methods

	// Core methods
	async setCookie(cookie: string) {
		this.cookie = cookie;
	}

	async setAPIKey(apiKey: string) {
		this.apiKey = apiKey;
	}

	async isLoggedIn(): Promise<boolean> {
		if (!this.cookie) return false;
		const response = await this.get("users", "users/authenticated");
		return response.ok;
	}


	// Request methods
	async request(endpoint: Endpoints, route: string, method: Methods, params?: Params, body?: Body): Promise<RequestResponse> {
		let url = this.baseURLs[endpoint] + route; // The URL to send the request to
		const headers: { [key: string]: string } = {
			"Content-Type": "application/json",
		}
		if (this.cookie) headers.Cookie = this.cookie;

		// Params
		if (params) {
			for (const key in params || {}) {
				if (url.includes("?")) url += "&";
				else url += "?";
				url += `${key}=${params[key]}`;
			}
		}
		const options = {} as RequestInit;


		options.method = method;
		options.headers = headers;

		if (body && method !== "GET") options.body = JSON.stringify(body);

		if (this.settings.debugMode) console.log(`[WrapBlox] Sending ${method} request to ${url} with body ${JSON.stringify(body)}`);
		const response = await fetch(url, options);
		if (this.settings.debugMode) console.log(`[WrapBlox] Got response ${response.status} from ${url}`);


		const json = await response.json();

		// Error Support
		if (!response.ok && this.settings.useErrors) throw new Error(`[WrapBlox] Got error ${response.status} from ${url} with body ${JSON.stringify(body)}`);


		const returnData = {
			status: response.status,
			ok: response.ok,
			body: json,
		}




		return returnData;
	}

	async get(endpoint: Endpoints, route: string, params?: Params) {
		return await this.request(endpoint, route, "GET", params);
	}

	async post(endpoint: Endpoints, route: string, params?: Params, body?: Body) {
		return await this.request(endpoint, route, "POST", params, body);
	}

	async patch(endpoint: Endpoints, route: string, params?: Params, body?: Body) {
		return await this.request(endpoint, route, "PATCH", params, body);
	}

	async delete(endpoint: Endpoints, route: string, params?: Params, body?: Body) {
		return await this.request(endpoint, route, "DELETE", params, body);
	}


	// User methods

	async getUser(id: number): Promise<User | undefined> {
		const response = await this.get("users", `users/${id}`);
		if (!response.ok) return undefined;

		return response.body; // USer data
	}

	async getUsernameHistory(id: number, limit?: number, sortOrder?: "Asc" | "Desc", cursor?: string): Promise<UserNameHistory | undefined> {
		const params = {} as { [key: string]: string };
		if (limit) params.limit = limit.toString();
		if (sortOrder) params.sortOrder = sortOrder;
		if (cursor) params.cursor = cursor;

		const response = await this.get("users", `users/${id}/username-history`, params);
		if (!response.ok) return undefined;
		return response.body;
	}

	async searchUsers(keyword: string, limit?: number, cursor?: string): Promise<SearchUsers | undefined> {
		const params = {} as { [key: string]: string };
		if (limit) params.limit = limit.toString();
		if (cursor) params.cursor = cursor;
		params.keyword = keyword;
		const response = await this.get("users", "users/search", params);
		if (!response.ok) return undefined;
		return response.body;
	}

	async getUserFromUsername(username: string): Promise<RequestedUser | undefined> {
		const user = await this.post("users", "usernames/users", {}, {
			usernames: [username],
		});
		if (!user.ok) return undefined;
		return user.body.data[0];
	}

	async getCurrentUserRoles(): Promise<string[] | undefined> {

		const response = await this.get("users", "users/authenticated/roles");
		if (!response.ok) return undefined;
		return response.body;
	}

	async getSelf(): Promise<SelfUser | undefined> {

		const response = await this.get("users", "users/authenticated");
		if (!response.ok) return undefined;
		return response.body;
	}

	async getUsers(ids: number[]): Promise<RequestedIDUser[] | undefined> {
		const response = await this.post("users", "users", {}, {
			userIds: ids,
		});
		if (!response.ok) return undefined;
		return response.body.data;
	}

	async GetUsersByUsernames(usernames: string[]): Promise<RequestedUser[] | undefined> {
		const response = await this.post("users", "usernames/users", {}, {
			usernames: usernames,
		});
		if (!response.ok) return undefined;
		return response.body.data;
	}

	// GROUPS 2

	async getGroups(ids: number[]): Promise<PartialGroup[] | undefined> {
		const response = await this.post("groups2", "groups", {}, {
			groupIds: ids,
		});
		if (!response.ok) return undefined;
		return response.body.data;
	}

	async getUserRoles(id: number, includeLocked?: boolean): Promise<RoleGroups[] | undefined> {
		const params = {} as Params;
		params.includeLocked = includeLocked ?? false;
		const response = await this.get("groups2", `users/${id}/groups/roles`, params);
		if (!response.ok) return undefined;
		return response.body.data;
	}

	async getWallPosts(id: number, sortOrder?: "Asc" | "Desc", limit?: number, cursor?: string): Promise<WallPosts | undefined> {
		const params = {} as Params;
		if (sortOrder) params.sortOrder = sortOrder;
		if (limit) params.limit = limit;
		if (cursor) params.cursor = cursor;
		const response = await this.get("groups2", `groups/${id}/wall/posts`, params);
		if (!response.ok) return undefined;
		return response.body;
	}

	// V1 Methods

	async getGroup(id: number): Promise<Group | undefined> {
		const response = await this.get("groups", `groups/${id}`);
		if (!response.ok) return undefined;
		return response.body;
	}

	async getGroupAuditLogs(id: number, actionType?: ActionTypes, userId?: number, limit?: number, cursor?: string, sortOrder?: "Asc" | "Desc"): Promise<AuditLogs | undefined> {

		const params = {} as Params;
		if (actionType) params.actionType = actionType;
		if (userId) params.userId = userId;
		if (limit) params.limit = limit;
		if (cursor) params.cursor = cursor;
		if (sortOrder) params.sortOrder = sortOrder;
		const response = await this.get("groups", `groups/${id}/audit-log`, params);
		if (!response.ok) return undefined;
		return response.body;

	}

	async getGroupNameHistory(id: number, limit?: number, cursor?: string, sortOrder?: "Asc" | "Desc"): Promise<GroupNameHistory | undefined> {
		const params = {} as Params;
		if (limit) params.limit = limit;
		if (cursor) params.cursor = cursor;
		if (sortOrder) params.sortOrder = sortOrder;
		const response = await this.get("groups", `groups/${id}/name-history`, params);
		if (!response.ok) return undefined;
		return response.body;
	}

	async getGroupSettings(id: number): Promise<GroupSettings | undefined> {
		const response = await this.get("groups", `groups/${id}/settings`);
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @param {number} id The group ID
	 * @param {GroupSettings} settings The settings to update
	 * @returns {boolean} whether the request was successful
	 * @example wrapblox.updateGroupSettings(1, {isApprovalRequired: true})
	 */
	async updateGroupSettings(id: number, settings: GroupSettings): Promise<boolean> {

		const response = await this.patch("groups", `groups/${id}/settings`, {}, settings);
		return response.ok;
	}

	/**
	 * 
	 * @returns {GroupMetadata} The metadata for groups
	 * @example wrapblox.getGroupsMetadata()
	 */

	async getGroupsMetadata(): Promise<GroupMetadata | undefined> {
		const response = await this.get("groups", "groups/configuration/metadata");
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @returns {SelfGroupMetadata} The groups metadata for the current user
	 * @example wrapblox.getSelfGroupMetadata()
	 */

	async getSelfGroupMetadata(): Promise<SelfGroupMetadata | undefined> {

		const response = await this.get("groups", "groups/metadata");
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @param {number} id The group ID
	 * @param {string} description The description to update
	 * @returns {boolean} Whether the request was successful
	 * @example wrapblox.updateGroupDescription(1, "This is a description")
	 */

	async updateGroupDescription(id: number, description: string): Promise<boolean> {

		const response = await this.patch("groups", `groups/${id}/description`, {}, {
			description: description,
		});
		return response.ok;
	}

	/**
	 * 
	 * @param id 
	 * @param name 
	 * @returns {boolean} Whether the request was successful
	 * @example wrapblox.updateGroupName(1, "New name")
	 */

	async updateGroupName(id: number, name: string): Promise<boolean> {

		const response = await this.patch("groups", `groups/${id}/name`, {}, {
			name: name,
		});
		return response.ok;
	}

	/**
	 * 
	 * @param id 
	 * @param status  The status/shout of the group
	 * @returns {boolean} Whether the request was successful
	 * @example wrapblox.setGroupStatus(1, "Status! or Shout!")
	 */

	async setGroupStatus(id: number, status: string): Promise<boolean> {

		const response = await this.patch("groups", `groups/${id}/status`, {}, {
			message: status,
		});
		return response.ok;
	}

	/**
	 * 
	 * @param id 
	 * @param shout The shout/status of the group
	 * @returns {boolean} Whether the request was successful
	 * @example wrapblox.setGroupStatus(1, "Status! or Shout!")
	 */

	async setGroupShout(id: number, shout: string): Promise<boolean> {
		return await this.setGroupStatus(id, shout);
	}

	/**
	 * 
	 * @param id ID of the group
	 * @param userIds Array of user IDs to decline
	 * @returns was the request successful
	 */

	async declineJoinRequests(id: number, userIds: number[]): Promise<boolean> {

		const response = await this.delete("groups", `groups/${id}/join-requests`, {}, {
			UserIds: userIds,
		});
		return response.ok;
	}

	/**
	 * 
	 * @param id group ID
	 * @param sortOrder "Asc" or "Desc"
	 * @param limit max amount of join requests to get
	 * @param cursor the cursor of data to get
	 * @returns {JoinRequests} The join requests
	 * @example const joinRequests = await wrapblox.getJoinRequests(1, "Asc", 100)
	 * const newRequests = await wrapblox.getJoinRequests(1, "Desc", 100, joinRequests.nextPageCursor)
	 */

	async getJoinRequests(id: number, sortOrder?: "Asc" | "Desc", limit?: number, cursor?: string): Promise<JoinRequests | undefined> {
		const params = {} as Params;
		if (sortOrder) params.sortOrder = sortOrder;
		if (limit) params.limit = limit;
		if (cursor) params.cursor = cursor;
		const response = await this.get("groups", `groups/${id}/join-requests`, params);
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @param id group ID
	 * @param userIds Array of user IDs to accept
	 * @returns was the request successful
	 */

	async acceptJoinRequests(id: number, userIds: number[]): Promise<boolean> {

		const response = await this.post("groups", `groups/${id}/join-requests`, {}, {
			UserIds: userIds,
		});
		return response.ok;
	}

	/**
	 * 
	 * @param id group ID
	 * @param userId user ID to decline
	 * @returns was the request successful
	 */

	async declineJoinRequest(id: number, userId: number): Promise<boolean> {

		const response = await this.delete("groups", `groups/${id}/join-requests/users/${userId}`);
		return response.ok;
	}

	/**
	 * 
	 * @param id group ID
	 * @param userId user ID to get join request of
	 * @returns was the request successful
	 */

	async getJoinRequest(id: number, userId: number): Promise<JoinRequest | undefined> {
		const response = await this.get("groups", `groups/${id}/join-requests/users/${userId}`);
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @param id group ID
	 * @param userId user ID to accept
	 * @returns was the request successful
	 */

	async acceptJoinRequest(id: number, userId: number): Promise<boolean> {

		const response = await this.post("groups", `groups/${id}/join-requests/users/${userId}`);
		return response.ok;
	}

	/**
	 * 
	 * @param groupId group ID
	 * @returns {Boolean} was the request successful
	 * @example wrapblox.setCookie("myCookie")
	 * const membership = await wrapblox.getSelfGroupMembership(1)
	 */

	async getSelfGroupMembership(groupId: number): Promise<SelfMembership | undefined> {

		const response = await this.get("groups", `groups/${groupId}/membership`);
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @param id group ID
	 * @returns the roles of the group
	 */

	async getGroupRoles(id: number): Promise<GroupRole[] | undefined> {
		const response = await this.get("groups", `groups/${id}/roles`);
		if (!response.ok) return undefined;
		return response.body.roles;
	}

	/**
	 * 
	 * @param id group ID
	 * @param roleId role ID
	 * @param limit max amount of members to get
	 * @param cursor the cursor of data to get
	 * @returns the members in the role
	 */

	async getGroupRoleMembers(id: number, roleId: number, sortOrder?: SortOrder, limit?: number, cursor?: string): Promise<GroupRoleMembers | undefined> {
		const params = {} as Params;
		if (limit) params.limit = limit;
		if (cursor) params.cursor = cursor;
		if (sortOrder) params.sortOrder = sortOrder;
		const response = await this.get("groups", `groups/${id}/roles/${roleId}/users`, params);
		if (!response.ok) return undefined;
		return response.body
	}

	/**
	 * 
	 * @param id group ID
	 * @param limit max amount of members to get (optional)
	 * @param cursor the cursor of data to get (optional)
	 * @param sortOrder "Asc" or "Desc" (optional)
	 * @returns {boolean} was the request successful
	 */

	async getGroupMembers(id: number, limit?: number, sortOrder?: SortOrder, cursor?: string): Promise<GroupRoleMembers | undefined> {
		const params = {} as Params;
		if (limit) params.limit = limit;
		if (cursor) params.cursor = cursor;
		if (sortOrder) params.sortOrder = sortOrder;
		const response = await this.get("groups", `groups/${id}/users`, params);
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * 
	 * @returns {Group[]} Groups that the user is pending in
	 */


	async getSelfPendingGroups(): Promise<Group[] | undefined> {
		const response = await this.get("groups", "user/groups/pending");
		if (!response.ok) return undefined;
		return response.body.data;
	}

	/**
	 * @param {number} userId The user ID to get the friends groups of
	 * @returns {FriendGroup[]} Groups that the user is in
	 */

	async getFriendGroups(userId: number): Promise<FriendGroup[] | undefined> {
		const response = await this.get("groups", `users/${userId}/friends/groups/roles`);
		if (!response.ok) return undefined;
		return response.body.data;
	}

	/**
	 * @param {number} userid The user ID to get the friends groups of
	 * @returns {GroupRoles[]} Groups that the user is in
	 */

	async getUsersRoles(userid: number): Promise<GroupRoles[] | undefined> {
		const response = await this.get("groups", `users/${userid}/groups/roles`);
		if (!response.ok) return undefined;
		return response.body.data;
	}

	/**
	 * @description Change the group owner
	 * @param {number} groupId The group ID to change the owner of
	 * @returns {boolean} Whether the request was successful
	 */

	async changeGroupOwner(groupId: number, userId: number): Promise<boolean> {
		const response = await this.post("groups", `groups/${groupId}/change-owner`, {}, {
			userId: userId,
		});
		return response.ok;
	}

	/**
	 * @description Claim ownership of a group as the current user
	 * @param {number} groupId The group ID to get the roles of
	 * @returns {boolean} Whether the request was successful
	 */

	async claimGroupOwnership(groupId: number): Promise<boolean> {
		const response = await this.post("groups", `groups/${groupId}/claim-ownership`);
		return response.ok;
	}

	/**
	 * @description Exile a user from a group
	 * @param {number} groupId The group ID to exile the user from
	 * @param {number} userId The user ID to exile
	 * @returns {boolean} Whether the request was successful
	 */

	async exileUserFromGroup(groupId: number, userId: number): Promise<boolean> {
		const response = await this.delete("groups", `groups/${groupId}/users/${userId}`);
		return response.ok;
	}

	/**
	 * @description Set a users role in a group
	 * @param {number} groupId The group ID to set the users role in
	 * @param {number} userId The user ID to set the role of
	 * @param {number} roleId The role ID to set the user to
	 * @returns {boolean} Whether the request was successful
	 */

	async setUsersRole(groupId: number, userId: number, roleId: number): Promise<boolean> {
		const response = await this.patch("groups", `groups/${groupId}/users/${userId}`, {}, {
			roleId: roleId,
		});
		return response.ok;
	}

	// Revenue Methods

	/**
	 * @description Get the payout restrictions of a group
	 * @param groupId The group ID to get the payout restrictions of
	 * @returns {{canUseRecurringPayout: boolean, canUseOneTimePayout: boolean} | undefined} The payout restrictions of the group
	 */

	async getPayoutRestrictions(groupId: number): Promise<{ canUseRecurringPayout: boolean, canUseOneTimePayout: boolean } | undefined> {
		const response = await this.get("groups", `groups/${groupId}/payout-restrictions`);
		if (!response.ok) return undefined;
		return response.body;
	}

	/**
	 * @description Get the payout percentages of a group
	 * @param groupId The group ID to get the payout percentages of
	 * @returns {PayoutPercentages | undefined} The payout percentages of the group
	 */
	async getGroupPayoutPercentages(groupId: number): Promise<PayoutPercentages | undefined> {
		const response = await this.get("groups", `groups/${groupId}/payouts`);
		if (!response.ok) return undefined;
		return response.body.data;
	}

	/**
	 * @description Gets information about roles
	 * @param roleIDs The role IDs to get
	 * @returns {Role[] | undefined} The roles
	 */

	async GetRoles(roleIDs: number[]): Promise<Role[] | undefined> {
		const params = {
			ids: roleIDs,
		}
		const response = await this.get("groups", "roles", params);

		if (!response.ok) return undefined;
		return response.body.data;
	}

	/**
	 * @description Gets information about a role
	 * @param roleID The role ID to get
	 * @returns {Role | undefined} The role
	 */

	async GetRole(roleID: number): Promise<Role | undefined> {
		const response = await this.get("groups", "roles", { ids: [roleID] });
		if (!response.ok) return undefined;
		return response.body.data[0];
	}
}


export default WrapBlox;
// Export types
export * from "./types/bases.js";
export * from "./types/groups.js";
export * from "./types/misc.js";
export * from "./types/users.js";