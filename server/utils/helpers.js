const {Op} = require("sequelize");
const  getDBFilterByDatePeriod = (period) =>{
    /*
    * 0 = month,
    * 1 = quarter,
    * 2 = half-year,
    * 3 = year
    * */
    const today = new Date();
    switch (period) {
        case 0:
            today.setMonth(today.getMonth()-1);
            break;
        case 1:
            today.setMonth(today.getMonth()-3);
            break;
        case 2:
            today.setMonth(today.getMonth()-6);
            break;
        case 3:
            today.setFullYear(today.getFullYear()-1);
            break;
    }

    return { [Op.gt]: today};
    /*return {
        [Op.gt]: new Date(today.getFullYear() - (period === 3 ? 1: 0),
            today.getMonth() - (period === 0 ? 1: (period === 1 ? 3 : 6)),
            today.getDate())
    }*/
}

module.exports = getDBFilterByDatePeriod;