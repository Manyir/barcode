import { checkUserAuth, logout } from "./auth.js";
import { setupInputHandlers } from "./inputHandler.js";
import { setupTableActions } from "./dataTable.js";
import { setupOptionHandlers } from "./options.js";
import { setupThemeListeners, updateThemeColor } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    checkUserAuth();
    setupInputHandlers();
    setupTableActions();
    setupOptionHandlers();
    setupThemeListeners();
    updateThemeColor();

    document.getElementById("logout-btn").addEventListener("click", logout);
});
