import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class HtmlControlador {
  mostrarResetPassword = (req, res) => {
    const ruta = path.join(__dirname, "../../public/reset-password.html");
    return res.sendFile(ruta);
  };
}


