/*const cityRoute = require("./cityRoute");
const wasteRoute = require("./wasteRoute");
const dimensionRoute = require("./dimensionRoute");
const roleRoute = require("./roleRoute");
const userRoute = require("./userRoute");
const dialogRoute = require("./dialogRoute");
const advertRoute = require("./advertRoute");
const messageRoute = require("./messageRoute");
const responseRoute = require("./responseRoute");
const authRoute = require("./authRoute");*/
import cityRoute from "./cityRoute.js";
import wasteRoute from "./wasteRoute.js";
import dimensionRoute from "./dimensionRoute.js";
import roleRoute from "./roleRoute.js";
import userRoute from "./userRoute.js";
import dialogRoute from "./dialogRoute.js";
import advertRoute from "./advertRoute.js";
import messageRoute from "./messageRoute.js";
import responseRoute from "./responseRoute.js";
import authRoute from "./authRoute.js";

const routeDictionary = {
    '/api/v1/cities': cityRoute,
    '/api/v1/wastes':  wasteRoute,
    '/api/v1/dimensions':  dimensionRoute,
    '/api/v1/roles': roleRoute,
    '/api/v1/users':  userRoute,
    '/api/v1/dialogs': dialogRoute,
    '/api/v1/adverts': advertRoute,
    '/api/v1/messages': messageRoute,
    '/api/v1/responses': responseRoute,
    '/api/v1/auth':  authRoute,
}
export default function setAppToRoutes(app){
    for(const route in routeDictionary){
        app.use(route,  routeDictionary[route]);
    }
}
//module.exports = setAppToRoutes;