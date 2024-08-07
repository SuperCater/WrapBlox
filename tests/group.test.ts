import WrapBlox from "../src/index.js";
import dotenv from "dotenv";

dotenv.config();

const client = new WrapBlox();

test("login", async () => {
	if (process.env.TESTCOOKIE === undefined) {
		console.log("No cookie provided, skipping test");
		return;
	}
	const user = await client.login(process.env.TESTCOOKIE);
	expect(user).toBeDefined();
})

test("getRawGroup", async () => {
	const group = await client.fetchRawGroup(10345148);
	expect(group).toBeDefined();
});

test("getGroup", async () => {
	const group = await client.fetchGroup(10345148);
	expect(group).toBeDefined();
});


test("getJoinRequests", async () => {
	if (process.env.TESTCOOKIE === undefined) {
		console.log("No cookie provided, skipping test");
		return;
	}
	const group = await client.fetchGroup(10345148);
	const joinRequests = await group.fetchJoinRequests();

	expect(joinRequests).toBeDefined();
});

test("getMembers", async () => {

	const group = await client.fetchGroup(10345148);
	const members = await group.fetchMembers();

	expect(members).toBeDefined();
});

test("getIcon", async () => {
	const group = await client.fetchGroup(10345148);
	const icon = await group.fetchIcon();


	expect(icon).toBeDefined();
});

test("getRoles", async () => {
	const group = await client.fetchGroup(10345148);
	const roles = await group.fetchRoles();


	expect(roles).toBeDefined();
});

test("getRoleMembers", async () => {
	const group = await client.fetchGroup(10345148);
	const roles = await group.fetchRoles();
	const members = await roles[1].fetchMembers();


	expect(members).toBeDefined();
})

test("searchGroups", async () => {
	const groups = await client.searchGroups("Pinewood Builders");

	expect(groups.length).toBeGreaterThan(0);
});
