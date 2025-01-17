const logout = () => {
    localStorage.removeItem("selected_product");
    localStorage.removeItem("token");
    localStorage.removeItem("total_value");
    localStorage.removeItem("categories");
    localStorage.removeItem("client");
    localStorage.removeItem("client_id");
    localStorage.removeItem("check_id");
    localStorage.removeItem("func");
};

export const LogoutService = {
    logout
};