import {Op} from "sequelize";

export default function getDBFilterByDatePeriod(period){
    /*
    * 0 = month,
    * 1 = quarter,
    * 2 = half-year,
    * 3 = year
    * */
    const today = new Date();
    return {
        [Op.gt]: new Date(today.getFullYear() - (period === 3 ? 1: 0),
            today.getMonth() - (period === 0 ? 1: (period === 1 ? 3 : 6)),
            today.getDate())
    }
}