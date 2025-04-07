import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useNotification = () => {
  const navigate = useNavigate();

  const notify = useCallback(async (id, client) => {
    let granted = false;

    if (Notification.permission === "granted") {
      granted = true;
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      granted = permission === "granted";
    }

    if (!granted) return;

    const notification = new Notification("Comanda Menu", {
      body: `${client}, tem um pedido pronto aí, ehm...`,
      icon: "/logo192.png",
    });

    notification.addEventListener("click", () => {
      navigate(`/${id}/wait_for_product`);
    });
  }, [navigate]);

  return notify;
};
