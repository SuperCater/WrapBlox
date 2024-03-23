import FetchHandler from "./Modules/fetchHandler.js";

class WrapBlox {
}


console.log(await FetchHandler.fetch('GET', 'Users', '/users/1'));


export default WrapBlox;