export function insertBarcodeIntoTable(barcode) {
  const dataTable = document.getElementById("dataTable");
  if (!dataTable) return;
  
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <td>제품명</td>
      <td>등급</td>
      <td>중량</td>
      <td>${barcode}</td>
  `;
  dataTable.appendChild(newRow);
}

export function setupTableActions() {
  const deleteButton = document.getElementById("deleteProduct");
  deleteButton.addEventListener("click", () => {
      const selectedRows = document.querySelectorAll("#dataTable .selected");
      if (selectedRows.length === 0) {
          alert("삭제할 제품을 선택하세요.");
          return;
      }
      if (confirm("정말 삭제하시겠습니까?")) {
          selectedRows.forEach(row => row.remove());
      }
  });
}
