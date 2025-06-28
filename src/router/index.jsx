import { Routes, Route } from "react-router-dom";

import {
    Home,

    Login,

    Admin,
    ManageUser,
    ClosedChecks,
    ShowEditProducts,
    FirstAccess,

    Waiter,
    CloseCheck,
    ListingChecks,
    ListingProducts,

    Cousine,
    Bartender,

    RegisterClient,
    Menu,
    Cart,
    ToPay,
    PaymentApproved,
    PaymentFailure,
    WaitForProducts,
    OnlineOrders,

    NotAuthorized,
    NotFound,

    SalesHistory,
} from "../pages";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/first_access" element={<FirstAccess />} />
            <Route path="/401" element={<NotAuthorized />} />

            <Route path="/:user_id/admin" element={<Admin />} />
            <Route path="/usuarios" element={<ManageUser />} />
            <Route path="/sales_history" element={<SalesHistory />} />
            <Route path="/comandasFinalizadas" element={<ClosedChecks />} />
            <Route path="/produtos" element={<ShowEditProducts />} />

            <Route path="/:user_id/garcom/comanda/:id" element={<Waiter />} />
            <Route path="/:user_id/garcom/comandas" element={<ListingChecks />} />
            <Route path="/:user_id/garcom/comanda/:id/add-product" element={<ListingProducts />} />
            <Route path="/:user_id/garcom/comanda/:id/fechar-comanda" element={<CloseCheck />} />

            <Route path="/:user_id/cozinha/producao" element={<Cousine />} />
            <Route path="/:user_id/barmen/producao" element={<Bartender />} />

            <Route path="/register_client" element={<RegisterClient />} />
            <Route path="/:id/products" element={<Menu />} />
            <Route path="/:id/cart" element={<Cart />} />
            <Route path="/:id/to-pay" element={<ToPay />} />
            <Route path="/:id/payment_approved" element={<PaymentApproved />} />
            <Route path="/:id/payment_failure" element={<PaymentFailure />} />
            <Route path="/:id/wait_for_product" element={<WaitForProducts />} />
            <Route path="/:id/created_online" element={<OnlineOrders />} />

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
};