# WrapBlox

Wrapblox is an API wrapper for the Roblox API written in typescript. It is currently in development and really isnt meant for production.

## Installation

Install using NPM

```bash
npm install wrapblox
```

## Usage

```typescript
import WrapBlox from "wrapblox";

const wrapblox = new WrapBlox("optional cookie", "optional API Key");

const user = await wrapblox.getUser(1); // Returns a user object
```

## Reasons to use WrapBlox

WrapBlox was made mainly just because i didnt like how alternative librarys worked for one reason or another. The main benefit of this over using something like noblox.js is that it doesnt use any extra dependencies and uses built in node functions.

Wrapblox is written in typescript so if you are using typescript you will get proper type checking with it.
