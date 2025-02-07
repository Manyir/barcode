document.addEventListener("DOMContentLoaded", () => {
  const clientCodeInput = document.getElementById("clientCode");
  const historyCheckbox = document.getElementById("useHistory");
  const keepHistoryCheckbox = document.getElementById("keepHistory");
  const historyNumberInput = document.getElementById("historyNumber");
  const barcodeInput = document.getElementById("barcodeInput");
  const orderTypeOut = document.querySelector("input[name='orderType'][value='출고']");
  const returnTypeNormal = document.querySelector("input[name='returnType'][value='정상']");
  const dataTable = document.getElementById("dataTable");

  function setActiveInput() {
      barcodeInput.disabled = false; // 바코드는 항상 활성화
      
      if (!historyCheckbox.checked) {
          // 이력번호 사용이 해제된 경우 → 이력번호 필드 및 고정 체크박스 비활성
          historyNumberInput.disabled = true;
          keepHistoryCheckbox.disabled = true;
          historyNumberInput.value = ""; // 이력번호 필드 초기화
          keepHistoryCheckbox.checked = false; // 고정 체크박스 해제
      } else {
          // 이력번호 사용이 체크된 경우
          historyNumberInput.disabled = false;
          keepHistoryCheckbox.disabled = false;
      }
  }

  clientCodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          setActiveInput();
          
          if (historyCheckbox.checked) {
              historyNumberInput.focus(); // ✅ 이력번호 사용 체크 시, 이력번호 필드로 포커스 이동
          } else {
              barcodeInput.focus(); // ✅ 이력번호 사용 해제 시, 바코드 입력 필드로 포커스 이동
          }
      }
  });

  historyNumberInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          barcodeInput.focus(); // ✅ 이력번호 입력 후 엔터 시, 바코드 입력 필드로 포커스 이동
      }
  });

  barcodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && barcodeInput.value.trim() !== "") {
          event.preventDefault();
          insertBarcodeIntoTable(barcodeInput.value.trim());
          barcodeInput.value = ""; // 입력 필드 초기화

          // ✅ 바코드 입력 후 포커스 이동 조건
          if (!historyCheckbox.checked || keepHistoryCheckbox.checked) {
              barcodeInput.focus(); // 이력번호 사용 해제 또는 고정 시 → 바코드 입력 유지
          } else {
              historyNumberInput.focus(); // 이력번호 사용 체크 + 고정 해제 시 → 이력번호 입력 필드로 포커스 이동
          }
      }
  });

  function insertBarcodeIntoTable(barcode) {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td><input type='checkbox'></td>
          <td></td> <!-- 제품명 없음 -->
          <td></td> <!-- 등급 없음 -->
          <td></td> <!-- 중량 없음 -->
          <td>${barcode}</td>
      `;
      dataTable.appendChild(newRow);
  }

  historyCheckbox.addEventListener("change", setActiveInput);
  keepHistoryCheckbox.addEventListener("change", setActiveInput);

  // 페이지 로드 시 기본값 설정 (출고 - 정상 선택)
  if (orderTypeOut) orderTypeOut.checked = true;
  if (returnTypeNormal) returnTypeNormal.checked = true;

  // 페이지 로드 시 이력번호 사용 상태 확인 후 필드 설정
  window.onload = setActiveInput;
});
