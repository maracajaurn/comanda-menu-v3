const logout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("func");
    localStorage.removeItem("selected_product");
};

export const LogoutService = {
    logout
};