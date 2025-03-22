const cityRoute = require("./cityRoute");
const wasteRoute = require("./wasteRoute");
const dimensionRoute = require("./dimensionRoute");
const roleRoute = require("./roleRoute");
const userRoute = require("./userRoute");
const dialogRoute = require("./dialogRoute");
const advertRoute = require("./advertRoute");
const messageRoute = require("./messageRoute");
const responseRoute = require("./responseRoute");
const authRoute = require("./authRoute");

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
function setAppToRoutes(app){
    for(const route in routeDictionary){
        app.use(route,  routeDictionary[route]);
    }
}
module.exports = setAppToRoutes;