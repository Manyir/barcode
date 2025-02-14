const themeColors = {
  "출고-정상": "#007bff",
  "출고-반품": "#dc3545",
  "입고-정상": "#28a745",
  "입고-반품": "#fd7e14",
};

export function updateThemeColor() {
  const orderType = document.querySelector("input[name='orderType']:checked").value;
  const returnType = document.querySelector("input[name='returnType']:checked").value;
  const themeKey = `${orderType}-${returnType}`;
  document.documentElement.style.setProperty("--main-color", themeColors[themeKey]);
}

export function setupThemeListeners() {
  document.querySelectorAll("input[name='orderType']").forEach(radio => {
      radio.addEventListener("change", updateThemeColor);
  });
  document.querySelectorAll("input[name='returnType']").forEach(radio => {
      radio.addEventListener("change", updateThemeColor);
  });
}
