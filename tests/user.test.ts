import WrapBlox from "../src/index.js";

const client = new WrapBlox();


test("getThumbnail", async () => {
	const user = await client.fetchUser(1);
	const thumbnail = await user.fetchUserAvatarThumbnailUrl();
	
	
	expect(thumbnail).toBeDefined();
})

test("groupTest", async () => {
	const user = await client.fetchUser(1494607434);
	expect(await user.inGroup(645836)).toBeTruthy();
});

test("role", async () => {
	const user = await client.fetchUser(1494607434);
	const roles = await user.fetchRoles()
	const role = await roles.getRole(645836)
	
	
	expect(role).toBeDefined();
});

test("userLookup", async () => {
	const users = await client.searchUsers("Cater")
	expect(users).toBeDefined();
})

test("badgeTest", async () => {
	const user = await client.fetchUser(1494607434);
	const ownsBadge = await user.ownsBadge(150538265);
	const ownsBadge2 = await user.ownsBadge(2124453108);
	
	const date = await user.getBadgeAwardedDate(150538265);
	
	expect(date).toBeDefined();
	expect(ownsBadge).toBeTruthy();
	expect(ownsBadge2).toBeFalsy();
	
})