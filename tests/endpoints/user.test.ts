import Friend from "../../src/Classes/Friend.js";
import FetchError from "../../src/Classes/Internal/FetchError.js";
import WrapBlox, { Badge, ItemTypes, User, UserPresence, Group } from "../../src/index.js";

import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
let preFetchedUser: User;
const userId = 2897964600;

test("login", async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	console.log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
});

/*
	Methods related to the Users API
	Docs: https://users.roblox.com/docs/index.html
*/

test("fetchUser", async () => {
	const userbyId = await client.fetchUser(userId);
	const userbyName = await client.fetchUser("Purple_Creativity");

	preFetchedUser = userbyId;
	console.log(`Fetched users: ${userbyId.toString()}, ${userbyName.toString()}`);

	expect(userbyId).toBeDefined();
	expect(userbyName).toBeDefined();
});

test("fetchUsernameHistory", async () => {
	const usernameHistory = await preFetchedUser.fetchUsernameHistory();

	console.log(`Fetched username history:\n${usernameHistory}`)

	expect(usernameHistory).toBeDefined();
});

/*
	Methods related to the Presence API
	Docs: https://presence.roblox.com/docs/index.html
*/

test("fetchLastOnlineDate", async () => {
	const date = await preFetchedUser.fetchLastOnlineDate();

	console.log(`Fetched user last online date: ${date.toDateString()}`);

	expect(date).toBeDefined();
	expect(date).toBeInstanceOf(Date);
});

test("fetchPresence", async () => {
	const presence = await preFetchedUser.fetchPresence();

	console.log("Fetched user presence:\n", presence);

	expect(presence).toBeDefined();
	expect(presence).toMatchObject<UserPresence>(presence);
})

/*
	Methods related to the Groups API
	Docs: https://groups.roblox.com/docs/index.html
*/

test("inGroup", async () => {
	const boolean = await preFetchedUser.inGroup(33991282);

	console.log(`In group [Purple Robotics, LLC]: ${boolean}`);

	expect(boolean).toBeDefined();
});

test("getRoleInGroup", async () => {
	const role = await preFetchedUser.getRoleInGroup(33991282);

	console.log("Role in group [Purple Robotics, LLC]:\n", role);
});

test("fetchPrimaryGroup", async () => {
	const primaryGroup = await preFetchedUser.fetchPrimaryGroup();

	console.log(`Primary group: ${primaryGroup?.toString()}`);
});

test("fetchGroups", async () => {
	const groups = await preFetchedUser.fetchGroups();

	console.log(`Fetched [${groups.length}] groups:\n`, groups.map((data: Group) => data.toString()).join("\n"));

	expect(groups).toBeDefined();
}, 60000)

/*
	Methods related to the Badges API
	Docs: https://badges.roblox.com/docs/index.html
*/

test("fetchBadges", async () => {
	const badges = await preFetchedUser.fetchBadges(1);

	console.log(`Fetched [${badges.length}] awarded badges:\n`, badges.map((data: Badge) => data.toString()).join("\n"));

	expect(badges).toBeDefined();
});

test("fetchBadgeAwardDate", async () => {
	const date = await preFetchedUser.fetchBadgeAwardDate(2124445684);

	console.log(`Badge awarded at: ${date?.toDateString()}`)
});

/*
	Methods related to the Inventory API
	Docs: https://inventory.roblox.com/docs/index.html
*/

test("canViewInventory", async () => {
	const canView = await preFetchedUser.canViewInventory();

	console.log(`Can view inventory: ${canView}`);

	expect(canView).toBeDefined();
});

test("ownsAsset", async () => {
	const bool = await preFetchedUser.ownsAsset(ItemTypes.GamePass, 776368);

	console.log(`Owns asset: ${bool}`);

	expect(bool).toBeDefined();
});

test("ownsBadge", async () => {
	const bool = await preFetchedUser.ownsBadge(150538398);

	console.log(`Owns Badge: ${bool}`);

	expect(bool).toBeDefined();
});

test("ownsGamepass", async () => {
	const bool = await preFetchedUser.ownsGamepass(776368);

	console.log(`Owns Gamepass: ${bool}`);

	expect(bool).toBeDefined();
});

test("ownsBundle", async () => {
	const bool = await preFetchedUser.ownsBundle(201);

	console.log(`Owns Bundle: ${bool}`);

	expect(bool).toBeDefined();
});

test("getOwnedAsset", async () => {

	const asset = await preFetchedUser.getOwnedAsset(ItemTypes.GamePass, 776368)

	console.log("Owned asset:\n",asset)
});

/*
	Methods related to the Avatar API
	Docs: https://avatar.roblox.com/docs/index.html
*/

test("fetchAvatarV1", async () => {
	
	const avatar = await preFetchedUser.fetchAvatarV1();

	console.log("User AvatarV1:\n",avatar)

	expect(avatar).toBeDefined();
});

test("fetchAvatarV2", async () => {
	
	const avatar = await preFetchedUser.fetchAvatarV2();

	console.log("User AvatarV2:\n",avatar)

	expect(avatar).toBeDefined();
});

/*
	Methods related to the Thumbnails API
	Docs: https://thumbnails.roblox.com/docs/index.html
*/

test("fetchAvatarThumbnailUrl", async () => {
	
	const imageUrl = await preFetchedUser.fetchAvatarThumbnailUrl();

	console.log(`Fetched imageUrl for Avatar Thumbnail:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

test("fetchAvatar3D", async () => {
	
	const data = await preFetchedUser.fetchAvatar3D();

	console.log("Fetched imageUrl for Avatar 3D:\n", data);

	expect(data).toBeDefined();
});

test("fetchAvatarBustUrl", async () => {
	
	const imageUrl = await preFetchedUser.fetchAvatarBustUrl();

	console.log(`Fetched imageUrl for Avatar Bust:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

test("fetchAvatarHeadshotUrl", async () => {
	
	const imageUrl = await preFetchedUser.fetchAvatarHeadshotUrl();

	console.log(`Fetched imageUrl for Avatar Headshot:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

/*
	Methods related to the Friends API
	Docs: https://friends.roblox.com/docs/index.html
*/

test("fetchFriendsMetadata", async () => {
	
	const metadata = await preFetchedUser.fetchFriendsMetadata();

	console.log("Fetched friends metadata:\n",metadata);

	expect(metadata).toBeDefined();
});


test("fetchUserFriends", async () => {
	if (!client.isLoggedIn()) {
		console.log("Not logged in, skipping...")
		return;
	}

	
	const users = await preFetchedUser.fetchFriends();

	console.log(`Fetched [${users.length}] friends:\n`,users.map((data: Friend) => data.toString()).join("\n"))

	expect(users).toBeDefined();
});


test("fetchUserFriendCount", async () => {
	
	const count = await preFetchedUser.fetchFriendCount();

	console.log(`Fetched friend count: [${count}]`);

	expect(count).toBeDefined();
});


test("fetchUserFollowers", async () => {
	
	const users = await preFetchedUser.fetchFollowers(10)

	console.log(`Fetched [${users.length}] followers:\n`,users.map((data: User) => data.toString()).join("\n"))

	expect(users).toBeDefined();
});


test("fetchUserFollowerCount", async () => {
	
	const count = await preFetchedUser.fetchFollowerCount();
	
	console.log(`Fetched follower count: [${count}]`);

	expect(count).toBeDefined();
});


test("fetchUserFollowings", async () => {
	
	const users = await preFetchedUser.fetchFollowings(10)

	console.log(`Fetched [${users.length}] followings:\n`,users.map((data: User) => data.toString()).join("\n"))

	expect(users).toBeDefined();
});


test("fetchUserFollowingsCount", async () => {
	
	const count = await preFetchedUser.fetchFollowingsCount();
	
	console.log(`Fetched following count: [${count}]`);
	console.log(preFetchedUser.accountAge)

	expect(count).toBeDefined();
});

/*
	Methods related to the AccountSettings API
	Docs: https://accountsettings.roblox.com/docs/index.html
*/

test("block", async () => {
	if (!client.isLoggedIn()) {
		console.log("Not logged in, skipping...")
		return;
	}

	
	try {
		await preFetchedUser.block();
	} catch (error) {
		if (!(error instanceof FetchError)) return;
		
		console.log(`Failed to block\n${await error.format()}`);
	}
});

test("unblock", async () => {
	if (!client.isLoggedIn()) {
		console.log("Not logged in, skipping...")
		return;
	}

	
	try {
		await preFetchedUser.unblock();
	} catch (error) {
		if (!(error instanceof FetchError)) return;

		console.log(`Failed to unblock\n${await error.format()}`);
	}
});

/*
	Methods related to the PremiumFeatures API
	Docs: https://premiumfeatures.roblox.com/docs/index.html
*/

test("hasPremium", async () => {
	if (!client.isLoggedIn()) {
		console.log("Not logged in, skipping...")
		return;
	}

	
	const hasPremium = await preFetchedUser.hasPremium();

	console.log(`hasPremium: ${hasPremium}`);

	expect(hasPremium).toBeDefined();
});