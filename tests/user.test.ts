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
	
	console.log(role)
	
	expect(role).toBeDefined();
});

test("userLookup", async () => {
	const users = await client.searchUsers("Cater")
	console.log(users)
	expect(users).toBeDefined();
})