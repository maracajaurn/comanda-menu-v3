const logout = () => {
    localStorage.removeItem("selected_product");
    localStorage.removeItem("list_stock");
    localStorage.removeItem("token");
    localStorage.removeItem("total_value");
    localStorage.removeItem("client");
    localStorage.removeItem("client_id");
    localStorage.removeItem("check_id");
    localStorage.removeItem("func");
    localStorage.removeItem("user_id");
};

export const LogoutService = {
    logout
};