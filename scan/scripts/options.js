export function setupOptionHandlers() {
  const historyCheckbox = document.getElementById("useHistory");
  const keepHistoryCheckbox = document.getElementById("keepHistory");
  const historyNumberInput = document.getElementById("historyNumber");

  function setActiveInput() {
      historyNumberInput.disabled = !historyCheckbox.checked;
      keepHistoryCheckbox.disabled = !historyCheckbox.checked;
      if (!historyCheckbox.checked) {
          historyNumberInput.value = "";
          keepHistoryCheckbox.checked = false;
      }
  }

  historyCheckbox.addEventListener("change", setActiveInput);
  keepHistoryCheckbox.addEventListener("change", setActiveInput);

  setActiveInput();
}
