import { Routes, Route, Navigate } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";

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

    Proof,
    Payment,
    RegisterClient
} from "../pages";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to={"/login"} />} />

            <Route path={`/admin`} element={
                <PrivateRoute><Admin /></PrivateRoute>
            } />
            <Route path={`/usuarios`} element={
                <PrivateRoute><ManageUser /></PrivateRoute>
            } />
            <Route path={`/comandasFinalizadas`} element={
                <PrivateRoute><ClosedChecks /></PrivateRoute>
            } />
            <Route path={`/produtos`} element={
                <PrivateRoute><ShowEditProducts /></PrivateRoute>
            } />

            <Route path={`/garcom/comanda/:id`} element={
                <PrivateRoute><Waiter /></PrivateRoute>
            } />
            <Route path={`/garcom/comandas`} element={
                <PrivateRoute><ListingChecks /></PrivateRoute>
            } />
            <Route path={`/garcom/comanda/:id/add-product`} element={
                <PrivateRoute><ListingProducts /></PrivateRoute>
            } />
            <Route path={`/garcom/comanda/:id/fechar-comanda`} element={
                <PrivateRoute><CloseCheck /></PrivateRoute>
            } />

            <Route path={`/cozinha/producao`} element={
                <PrivateRoute><Cousine /></PrivateRoute>
            } />
            <Route path={`/barmen/producao`} element={
                <PrivateRoute><Bartender /></PrivateRoute>
            } />

            <Route path={`/resister-client`} element={<RegisterClient />} />
            <Route path={`/payment`} element={<Payment />} />
            <Route path={`/proof`} element={<Proof />} />
        </Routes>
    );
};