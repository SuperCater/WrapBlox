import WrapBlox from "../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const client = new WrapBlox();

test("login", async () => {
	if (!process.env.TESTCOOKIE) {
		console.log("No cookie provided, skipping...")
		return;
	}

	const user = await client.login(process.env.TESTCOOKIE)
	console.log(`Logged in as ${user.name}:${user.id}`)

	expect(user).toBeDefined();
})

test("fetchAwardedDate", async () => {
    const user = await client.fetchUser(2897964600)
    const badges = await user.fetchBadges("Asc", 1);
    const badge = badges[0];
    const date = await badge.fetchAwardedDate();

    console.log(`Badge awarded on: ${date?.toDateString()}`);
})