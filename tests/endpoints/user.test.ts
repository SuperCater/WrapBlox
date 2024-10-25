import Friend from "../../src/Classes/Friend.js";
import FetchError from "../../src/Classes/Internal/FetchError.js";
import WrapBlox, { Badge, ItemTypes, User, UserPresence, Group, Universe, GroupRole, OwnedAsset, AvatarV1, AvatarV2, Avatar3D, FriendMetadata } from "../../src/index.js";

import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();
let preFetchedUser: User;
const userId = 2897964600;
const silent = true;

const log = (message: unknown, ...optionalParams: unknown[]) => {
	if (silent) return;
	console.log(message, ...optionalParams);
};

const authenticated = () => {
	if (!client.isLoggedIn()) {
		log("Not logged in, skipping...")
		return false;
	}

	return true;
}

beforeAll(async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...");
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE);
	log(`Logged in as ${user.name}:${user.id}`);

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
	log(`Fetched users: ${userbyId.toString()}, ${userbyName.toString()}`);

	expect(userbyId).toBeDefined();
	expect(userbyId).toBeInstanceOf(User);
	
	expect(userbyName).toBeDefined();
	expect(userbyName).toBeInstanceOf(User);
});

test("fetchUsernameHistory", async () => {
	const usernameHistory = await preFetchedUser.fetchUsernameHistory();

	log(`Fetched username history:\n${usernameHistory}`)

	expect(usernameHistory).toBeDefined();
	expect(usernameHistory).toBeInstanceOf(Array);
});

/*
	Methods related to the Presence API
	Docs: https://presence.roblox.com/docs/index.html
*/

test("fetchLastOnlineDate", async () => {
	const date = await preFetchedUser.fetchLastOnlineDate();

	log(`Fetched user last online date: ${date.toDateString()}`);

	expect(date).toBeDefined();
	expect(date).toBeInstanceOf(Date);
});

test("fetchPresence", async () => {
	const presence = await preFetchedUser.fetchPresence();

	log("Fetched user presence:\n", presence);

	expect(presence).toBeDefined();
	expect(presence).toMatchObject<UserPresence>(presence);
})

/*
	Methods related to the Games API
	Docs: https://games.roblox.com/docs/index.html
*/

test("fetchCreatedUniverses", async () => {
	const universes = await preFetchedUser.fetchCreatedUniverses(1);

	log(`Fetched [${universes.length}] created universes:\n`, universes.map((data: Universe) => data.toString()).join("\n"));

	expect(universes).toBeDefined();
	expect(universes).toBeInstanceOf(Array);
	
	for (const universe of universes) {
		expect(universe).toBeInstanceOf(Universe);
	}
});

/*
	Methods related to the Groups API
	Docs: https://groups.roblox.com/docs/index.html
*/

test("inGroup", async () => {
	const boolean = await preFetchedUser.inGroup(33991282);

	log(`In group [Purple Robotics, LLC]: ${boolean}`);

	expect(boolean).toBeDefined();
	expect(boolean).toBeInstanceOf(Boolean);
});

test("getRoleInGroup", async () => {
	const role = await preFetchedUser.getRoleInGroup(33991282);

	log("Role in group [Purple Robotics, LLC]:\n", role);

	if (role) {
		expect(role).toMatchObject<GroupRole>(role);
	};
});

test("fetchPrimaryGroup", async () => {
	const primaryGroup = await preFetchedUser.fetchPrimaryGroup();

	log(`Primary group: ${primaryGroup?.toString()}`);

	if (primaryGroup) {
		expect(primaryGroup).toBeInstanceOf(Group);
	};
});

test("fetchGroups", async () => {
	const groups = await preFetchedUser.fetchGroups();

	log(`Fetched [${groups.length}] groups:\n`, groups.map((data: Group) => data.toString()).join("\n"));

	expect(groups).toBeDefined();

	for (const group of groups) {
		expect(group).toBeInstanceOf(Group);
	};
}, 60000)

/*
	Methods related to the Badges API
	Docs: https://badges.roblox.com/docs/index.html
*/

test("fetchBadges", async () => {
	const badges = await preFetchedUser.fetchBadges(1);

	log(`Fetched [${badges.length}] awarded badges:\n`, badges.map((data: Badge) => data.toString()).join("\n"));

	expect(badges).toBeDefined();

	for (const badge of badges) {
		expect(badge).toBeInstanceOf(Badge);
	};
});

test("fetchBadgeAwardDate", async () => {
	const date = await preFetchedUser.fetchBadgeAwardDate(2124445684);

	log(`Badge awarded at: ${date?.toDateString()}`);

	if (date) {
		expect(date).toBeInstanceOf(Date);
	};
});

/*
	Methods related to the Inventory API
	Docs: https://inventory.roblox.com/docs/index.html
*/

test("canViewInventory", async () => {
	const canView = await preFetchedUser.canViewInventory();

	log(`Can view inventory: ${canView}`);

	expect(canView).toBeDefined();
	expect(canView).toBeInstanceOf(Boolean);
});

test("ownsAsset", async () => {
	const bool = await preFetchedUser.ownsAsset(ItemTypes.GamePass, 776368);

	log(`Owns asset: ${bool}`);

	expect(bool).toBeDefined();
	expect(bool).toBeInstanceOf(Boolean);
});

test("ownsBadge", async () => {
	const bool = await preFetchedUser.ownsBadge(150538398);

	log(`Owns Badge: ${bool}`);

	expect(bool).toBeDefined();
	expect(bool).toBeInstanceOf(Boolean);
});

test("ownsGamepass", async () => {
	const bool = await preFetchedUser.ownsGamepass(776368);

	log(`Owns Gamepass: ${bool}`);

	expect(bool).toBeDefined();
	expect(bool).toBeInstanceOf(Boolean);
});

test("ownsBundle", async () => {
	const bool = await preFetchedUser.ownsBundle(201);

	log(`Owns Bundle: ${bool}`);

	expect(bool).toBeDefined();
	expect(bool).toBeInstanceOf(Boolean);
});

test("getOwnedAsset", async () => {
	const asset = await preFetchedUser.getOwnedAsset(ItemTypes.GamePass, 776368)

	log("Owned asset:\n",asset)

	if (asset) {
		expect(asset).toMatchObject<OwnedAsset>(asset);
	}
});

/*
	Methods related to the Avatar API
	Docs: https://avatar.roblox.com/docs/index.html
*/

test("fetchAvatarV1", async () => {
	
	const avatar = await preFetchedUser.fetchAvatarV1();

	log("User AvatarV1:\n",avatar)

	expect(avatar).toBeDefined();
	expect(avatar).toMatchObject<AvatarV1>(avatar)
});

test("fetchAvatarV2", async () => {
	
	const avatar = await preFetchedUser.fetchAvatarV2();

	log("User AvatarV2:\n",avatar)

	expect(avatar).toBeDefined();
	expect(avatar).toMatchObject<AvatarV2>(avatar)
});

/*
	Methods related to the Thumbnails API
	Docs: https://thumbnails.roblox.com/docs/index.html
*/

test("fetchAvatarThumbnailUrl", async () => {
	const imageUrl = await preFetchedUser.fetchAvatarThumbnailUrl();

	log(`Fetched imageUrl for Avatar Thumbnail:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
	expect(imageUrl).toBeInstanceOf(String);
});

test("fetchAvatar3D", async () => {
	const data = await preFetchedUser.fetchAvatar3D();

	log("Fetched imageUrl for Avatar 3D:\n", data);

	expect(data).toBeDefined();
	expect(data).toMatchObject<Avatar3D>(data);
});

test("fetchAvatarBustUrl", async () => {
	const imageUrl = await preFetchedUser.fetchAvatarBustUrl();

	log(`Fetched imageUrl for Avatar Bust:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

test("fetchAvatarHeadshotUrl", async () => {
	const imageUrl = await preFetchedUser.fetchAvatarHeadshotUrl();

	log(`Fetched imageUrl for Avatar Headshot:\n${imageUrl}`);

	expect(imageUrl).toBeDefined();
});

/*
	Methods related to the Friends API
	Docs: https://friends.roblox.com/docs/index.html
*/

test("fetchFriendsMetadata", async () => {
	const metadata = await preFetchedUser.fetchFriendsMetadata();

	log("Fetched friends metadata:\n",metadata);

	expect(metadata).toBeDefined();
	expect(metadata).toMatchObject<FriendMetadata>(metadata);
});


test("fetchUserFriends", async () => {
	if (!authenticated()) return;

	const users = await preFetchedUser.fetchFriends();

	log(`Fetched [${users.length}] friends:\n`,users.map((data: Friend) => data.toString()).join("\n"))

	expect(users).toBeDefined();
	for (const friend of users) {
		expect(friend).toBeInstanceOf(Friend);
	}
});


test("fetchUserFriendCount", async () => {
	const count = await preFetchedUser.fetchFriendCount();

	log(`Fetched friend count: [${count}]`);

	expect(count).toBeDefined();
	expect(count).toBeInstanceOf(Number);
});


test("fetchUserFollowers", async () => {
	
	const users = await preFetchedUser.fetchFollowers(10)

	log(`Fetched [${users.length}] followers:\n`,users.map((data: User) => data.toString()).join("\n"))

	expect(users).toBeDefined();
	for (const user of users) {
		expect(user).toBeInstanceOf(User);
	}
});


test("fetchUserFollowerCount", async () => {
	const count = await preFetchedUser.fetchFollowerCount();
	
	log(`Fetched follower count: [${count}]`);

	expect(count).toBeDefined();
	expect(count).toBeInstanceOf(Number);
});


test("fetchUserFollowings", async () => {
	const users = await preFetchedUser.fetchFollowings(10)

	log(`Fetched [${users.length}] followings:\n`,users.map((data: User) => data.toString()).join("\n"))

	expect(users).toBeDefined();
	for (const user of users) {
		expect(user).toBeInstanceOf(User);
	}
});


test("fetchUserFollowingsCount", async () => {
	const count = await preFetchedUser.fetchFollowingsCount();
	
	log(`Fetched following count: [${count}]`);

	expect(count).toBeDefined();
	expect(count).toBeInstanceOf(Number);
});

/*
	Methods related to the AccountSettings API
	Docs: https://accountsettings.roblox.com/docs/index.html
*/

test("block", async () => {
	if (!authenticated()) return;
	
	try {
		await preFetchedUser.block();
	} catch (error) {
		if (!(error instanceof FetchError)) return;
		
		log(`Failed to block\n${await error.format()}`);
	}
});

test("unblock", async () => {
	if (!authenticated()) return;
	
	try {
		await preFetchedUser.unblock();
	} catch (error) {
		if (!(error instanceof FetchError)) return;

		log(`Failed to unblock\n${await error.format()}`);
	}
});

/*
	Methods related to the PremiumFeatures API
	Docs: https://premiumfeatures.roblox.com/docs/index.html
*/

test("hasPremium", async () => {
	if (!authenticated()) return;
	
	const hasPremium = await preFetchedUser.hasPremium();

	log(`hasPremium: ${hasPremium}`);

	expect(hasPremium).toBeDefined();
	expect(hasPremium).toBeInstanceOf(Boolean);
});