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
                    <section className="flex flex-col items-center text-center max-w-4xl space-y-8 animate-fadeUp">

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <img
                                className="w-40 md:w-56 rounded-full shadow-lg transition-transform hover:scale-105"
                                src="logo192.png"
                                alt="Logo Comanda Menu"
                            />

                            <div className="text-center sm:text-left">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-balance leading-tight">
                                    Gerencie comandas com agilidade
                                </h1>
                                <p className="text-lg text-gray-300 mt-3 max-w-md">
                                    Uma solução moderna e prática para bares, restaurantes e pubs.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl transition">
                                Acessar Sistema
                            </button>
                            <button
                                onClick={() => navigate("/register_client")}
                                className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold px-6 py-3 rounded-xl transition">
                                Abrir Comanda
                            </button>
                        </div>
                    </section>

                    <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 w-full max-w-6xl">
                        {[
                            {
                                icon: "📱",
                                title: "Notificações em tempo real",
                                desc: "Acompanhe pedidos e comandas sem perder tempo.",
                            },
                            {
                                icon: "🧾",
                                title: "Abertura fácil de comandas",
                                desc: "Clientes abrem a própria comanda pelo celular.",
                            },
                            {
                                icon: "🍻",
                                title: "Feito para bares e restaurantes",
                                desc: "Foco total na rotina do seu negócio.",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="py-6 text-sm text-gray-500 text-center border-t border-gray-800">
                    © 2025 Comanda Menu. Todos os direitos reservados.
                </footer>
            </div>
        </>
    );
};
