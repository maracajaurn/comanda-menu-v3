const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("func");
};

export const LogoutService = {
    logout
};