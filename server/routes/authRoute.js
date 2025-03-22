import Router from "express";
import {signup, login} from "../controllers/authController.js";
const router = Router();
//const router = route.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

export default router;
//module.exports = router;