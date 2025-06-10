import { useNavigate } from "react-router-dom";

export const Footer = ({ id, totalValue, checkStatus, is_client,  user_id }) => {

    const navigate = useNavigate();

    return (
        <>
            {is_client ? (
                <footer className="fixed bottom-0 w-full h-[130px] flex items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                    <div className="container mx-auto text-center">
                        <p className="text-sm">Desenvolvido por <strong>Jackson Souza</strong></p>
                        <p className="text-sm">© 2025 - Todos os direitos reservados.</p>
                        <div className="flex justify-center space-x-4 mt-3">
                            <a
                                href="https://instagram.com/jackssads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline bg-slate-900 rounded-md p-3"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.linkedin.com/in/jackson-souza-ads/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline bg-slate-900 rounded-md p-3"
                            >
                                Linkedin
                            </a>
                        </div>
                    </div>
                </footer>
            ) : (
                <footer className="fixed bottom-0 w-full h-[130px] flex flex-col justify-between items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                    <h4 className="text-[22px] font-bold text-white"
                    >Valor Total: <span className="font-semibold text-[#1C1D26]">R$ {totalValue}</span></h4>

                    {checkStatus ? (
                        <button className="w-2/3 px-1 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate(`/${user_id}/garcom/comanda/${id}/fechar-comanda`)}
                        >Finalizar</button>
                    ) : (
                        <button className="w-2/3 px-1 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate(`/${user_id}/garcom/comanda/${id}/fechar-comanda`)}
                        >Atualizar</button>
                    )}
                </footer>
            )}
        </>
    );
};