import { Routes, Route, Navigate } from "react-router-dom";

import {
    Login,

    Admin,
    ManageUser,
    ClosedChecks,
    ShowEditProducts,

    Waiter,
    CloseCheck,
    ListingChecks,
    ListingProducts,

    Cousine,
    Bartender,

    RegisterClient,
    Menu,
    Cart,
    Proof,
} from "../pages";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to={"/login"} />} />

            <Route path={`/admin`} element={
                <Admin />
            } />
            <Route path={`/usuarios`} element={
                <ManageUser />
            } />
            <Route path={`/comandasFinalizadas`} element={
                <ClosedChecks />
            } />
            <Route path={`/produtos`} element={
                <ShowEditProducts />
            } />

            <Route path={`/garcom/comanda/:id`} element={
                <Waiter />
            } />
            <Route path={`/garcom/comandas`} element={
                <ListingChecks />
            } />
            <Route path={`/garcom/comanda/:id/add-product`} element={
                <ListingProducts />
            } />
            <Route path={`/garcom/comanda/:id/fechar-comanda`} element={
                <CloseCheck />
            } />

            <Route path={`/cozinha/producao`} element={
                <Cousine />
            } />
            <Route path={`/barmen/producao`} element={
                <Bartender />
            } />

            <Route path={`/resister-client`} element={<RegisterClient />} />
            <Route path={`/:id/products`} element={<Menu />} />
            <Route path={`/:id/cart`} element={<Cart />} />
            <Route path={`/:id/proof`} element={<Proof />} />
        </Routes>
    );
};