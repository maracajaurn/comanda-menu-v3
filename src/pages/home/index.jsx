import { Navbar } from "../../components";
import { useLoader } from "../../contexts";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    const { setLoading } = useLoader();
    setLoading(false);

    return (
        <>
            <Navbar title={"Comanda Menu"} />
            <div className="w-full -mt-10 bg-gray-900 text-white min-h-screen flex flex-col">
                <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
                    <section className="text-center max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Gerencie comandas com agilidade
                        </h1>
                        <p className="text-lg text-gray-300 mb-6">
                            Uma solução moderna e prática para bares, restaurantes e pubs.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl transition"
                        >
                            Acessar Sistema
                        </button>
                    </section>

                    <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-4">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                            <span className="text-3xl">📱</span>
                            <h3 className="text-xl font-bold mt-2">Notificações em tempo real</h3>
                            <p className="text-gray-400 mt-1 text-sm">
                                Acompanhe pedidos e comandas sem perder tempo.
                            </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                            <span className="text-3xl">🧾</span>
                            <h3 className="text-xl font-bold mt-2">Abertura fácil de comandas</h3>
                            <p className="text-gray-400 mt-1 text-sm">
                                Clientes abrem a própria comanda pelo celular.
                            </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                            <span className="text-3xl">🍻</span>
                            <h3 className="text-xl font-bold mt-2">Feito para bares e restaurantes</h3>
                            <p className="text-gray-400 mt-1 text-sm">
                                Foco total na rotina do seu negócio.
                            </p>
                        </div>
                    </section>
                </main>

                <footer className="py-6 text-sm text-gray-500 text-center">
                    © 2025 Comanda Menu. Todos os direitos reservados.
                </footer>
            </div>
        </>
    );
};
