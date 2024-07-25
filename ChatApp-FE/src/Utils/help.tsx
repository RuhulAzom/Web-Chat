import Cookie from "js-cookie";

export const token = Cookie.get("token")
const user_datas_tr = Cookie.get("user_data")
export const getUserData = () => {
    if (user_datas_tr) {
        const jsonData = JSON.parse(user_datas_tr)
        return jsonData;
    }
}