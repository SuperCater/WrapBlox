import WrapBlox from "../src/index.js";

const client = new WrapBlox();

test("getRawUser", async () => {
	const user = await client.fetchRawUser(1);
	
	expect(user).toBeDefined();
});

test("getUser", async () => {
	const user = await client.fetchUser(1);
	
	expect(user).toBeDefined();
});


test("getThumbnail", async () => {
	const user = await client.fetchUser(1);
	const thumbnail = await user.fetchUserAvatarThumbnailUrl();
	
	console.log(thumbnail);
	expect(thumbnail).toBeDefined();
})