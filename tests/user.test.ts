import AwardedBadge from "../src/Classes/AwardedBadge.js";
import Friend from "../src/Classes/Friend.js";
import Group from "../src/Classes/Group.js";
import FetchError from "../src/Classes/Internal/FetchError.js";
import WrapBlox, { ItemTypes, User } from "../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
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

	console.log(`Fetched users: ${userbyId.toString()}, ${userbyName.toString()}`);

	expect(userbyId).toBeDefined();
	expect(userbyName).toBeDefined();
});

test("fetchUsernameHistory", async () => {
	const user = await client.fetchUser(userId);
	const usernameHistory = await user.fetchUsernameHistory();

	console.log(`Fetched username history:\n${usernameHistory}`)

	expect(usernameHistory).toBeDefined();
});

/*
	Methods related to the Groups API
	Docs: https://groups.roblox.com/docs/index.html
*/

test("inGroup", async () => {
	const user = await client.fetchUser(userId);
	const boolean = await user.inGroup(33991282);

	console.log(`In group [Purple Robotics, LLC]: ${boolean}`);

	expect(boolean).toBeDefined();
});

test("getRoleInGroup", async () => {
	const user = await client.fetchUser(userId);
	const role = await user.getRoleInGroup(33991282);

	console.log("Role in group [Purple Robotics, LLC]:\n", role);
});

test("fetchPrimaryGroup", async () => {
	const user = await client.fetchUser(userId);
	const primaryGroup = await user.fetchPrimaryGroup();

	console.log(`Primary group: ${primaryGroup?.toString()}`);

	expect(primaryGroup).toBeDefined();
});

test("fetchGroups", async () => {
	const user = await client.fetchUser(userId);
	const groups = await user.fetchGroups();

	console.log(`Fetched [${groups.length}] groups\n:`, groups.map((data: Group) => data.toString()).join("\n"));

	expect(groups).toBeDefined();
}, 60000)

/*
	Methods related to the Badges API
	Docs: https://badges.roblox.com/docs/index.html
*/

test("fetchBadges", async () => {
	const user = await client.fetchUser(userId);
	const badges = await user.fetchBadges("Asc", 1);

	console.log(`Fetched [${badges.length}] awarded badges\n:`, badges.map((data: AwardedBadge) => data.toString()).join("\n"));

	expect(badges).toBeDefined();
});

test("fetchBadgeAwardDate", async () => {
	const user = await client.fetchUser(userId);
	const date = await user.fetchBadgeAwardDate(2124445684);

	console.log(`Badge awarded at: ${date?.toDateString()}`)
});

/*
	Methods related to the Inventory API
	Docs: https://inventory.roblox.com/docs/index.html
*/

test("canViewInventory", async () => {
	const user = await client.fetchUser(userId);
	const canView = await user.canViewInventory();

	console.log(`Can view inventory: ${canView}`);

	expect(canView).toBeDefined();
});

test("ownsAsset", async () => {
	const user = await client.fetchUser(userId);
	const bool = await user.ownsAsset(ItemTypes.GamePass, 776368);

	console.log(`Owns asset: ${bool}`);

	expect(bool).toBeDefined();
});

test("ownsBadge", async () => {
	const user = await client.fetchUser(userId);
	const bool = await user.ownsBadge(150538398);

	console.log(`Owns Badge: ${bool}`);

	expect(bool).toBeDefined();
});

test("ownsGamepass", async () => {
	const user = await client.fetchUser(userId);
	const bool = await user.ownsGamepass(776368);

	console.log(`Owns Gamepass: ${bool}`);

	expect(bool).toBeDefined();
});

test("ownsBundle", async () => {
	const user = await client.fetchUser(userId);
	const bool = await user.ownsBundle(201);

	console.log(`Owns Bundle: ${bool}`);

	expect(bool).toBeDefined();
});

test("getOwnedAsset", async () => {
	const user = await client.fetchUser(userId);
	const asset = await user.getOwnedAsset(ItemTypes.GamePass, 776368)

	console.log("Owned asset:\n",asset)
});

/*
	Methods related to the Avatar API
	Docs: https://avatar.roblox.com/docs/index.html
*/

test("fetchAvatarV1", async () => {
	const user = await client.fetchUser(userId);
	const avatar = await user.fetchAvatarV1();

	console.log("User AvatarV1:\n",avatar)

	expect(avatar).toBeDefined();
});

test("fetchAvatarV2", async () => {
	const user = await client.fetchUser(userId);
	const avatar = await user.fetchAvatarV2();

	console.log("User AvatarV2:\n",avatar)

	expect(avatar).toBeDefined();
});

/*
	Methods related to the Thumbnails API
	Docs: https://thumbnails.roblox.com/docs/index.html
*/

test("fetchAvatarThumbnailUrl", async () => {
	const user = await client.fetchUser(userId);
	const imageUrl = await user.fetchAvatarThumbnailUrl();

	console.log(`Fetched imageUrl for Avatar Thumbnail:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

test("fetchAvatar3D", async () => {
	const user = await client.fetchUser(userId);
	const data = await user.fetchAvatar3D();

	console.log("Fetched imageUrl for Avatar 3D:\n", data);

	expect(data).toBeDefined();
});

test("fetchAvatarBustUrl", async () => {
	const user = await client.fetchUser(userId);
	const imageUrl = await user.fetchAvatarBustUrl();

	console.log(`Fetched imageUrl for Avatar Bust:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

test("fetchAvatarHeadshotUrl", async () => {
	const user = await client.fetchUser(userId);
	const imageUrl = await user.fetchAvatarHeadshotUrl();

	console.log(`Fetched imageUrl for Avatar Headshot:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

/*
	Methods related to the Friends API
	Docs: https://friends.roblox.com/docs/index.html
*/

test("fetchFriendsMetadata", async () => {
	const user = await client.fetchUser(userId);
	const metadata = await user.fetchFriendsMetadata();

	console.log("Fetched friends metadata:\n",metadata);

	expect(metadata).toBeDefined();
});


test("fetchUserFriends", async () => {
	if (!client.isLoggedIn()) {
		console.log("Not logged in, skipping...")
		return;
	}

	const user = await client.fetchUser(userId);
	const users = await user.fetchFriends();

	console.log(`Fetched friends [${users.length}]\n`,users.map((data: Friend) => data.toString()).join("\n"))

	expect(users).toBeDefined();
});


test("fetchUserFriendCount", async () => {
	const user = await client.fetchUser(userId);
	const count = await user.fetchFriendCount();

	console.log(`Fetched friend count: [${count}]`);

	expect(count).toBeDefined();
});


test("fetchUserFollowers", async () => {
	const user = await client.fetchUser(userId);
	const users = await user.fetchFollowers("Asc", 10)

	console.log(`Fetched followers [${users.length}]\n`,users.map((data: User) => data.toString()).join("\n"))

	expect(users).toBeDefined();
});


test("fetchUserFollowerCount", async () => {
	const user = await client.fetchUser(userId);
	const count = await user.fetchFollowerCount();
	
	console.log(`Fetched follower count: [${count}]`);

	expect(count).toBeDefined();
});


test("fetchUserFollowings", async () => {
	const user = await client.fetchUser(userId);
	const users = await user.fetchFollowings("Asc", 10)

	console.log(`Fetched followings [${users.length}]\n`,users.map((data: User) => data.toString()).join("\n"))

	expect(users).toBeDefined();
});


test("fetchUserFollowingsCount", async () => {
	const user = await client.fetchUser(userId);
	const count = await user.fetchFollowingsCount();
	
	console.log(`Fetched following count: [${count}]`);
	console.log(user.accountAge)

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

	const user = await client.fetchUser(userId);
	try {
		await user.block();
	} catch (error) {
		if (!(error instanceof FetchError)) return;
		const body = await error.response.json();

		console.log(`Failed to block [${error.message}]:\n${body.errors[0]?.code}: ${body.errors[0]?.message}`)
	}
});

test("unblock", async () => {
	if (!client.isLoggedIn()) {
		console.log("Not logged in, skipping...")
		return;
	}

	const user = await client.fetchUser(userId);
	try {
		await user.unblock();
	} catch (error) {
		if (!(error instanceof FetchError)) return;
		const body = await error.response.json();

		console.log(`Failed to unblock [${error.message}]:\n${body.errors[0]?.code}: ${body.errors[0]?.message}`)
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

	const user = await client.fetchUser(userId);
	const hasPremium = await user.hasPremium();

	console.log(`hasPremium: ${hasPremium}`);

	expect(hasPremium).toBeDefined();
});