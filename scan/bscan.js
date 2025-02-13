document.addEventListener("DOMContentLoaded", async () => {
  try {
      const response = await fetch("/user-info");
      if (!response.ok) {
          window.location.href = "/"; // 로그인 안 됐으면 로그인 페이지로 이동
          return;
      }
      const data = await response.json();
      document.getElementById("username-display").innerText = `사용자: ${data.username}`;
  } catch (error) {
      console.error("❌ 사용자 정보 로드 실패:", error);
      window.location.href = "/";
  }

document.getElementById("logout-btn").addEventListener("click", async () => {
  const confirmLogout = confirm("정말 로그아웃 하시겠습니까?");
  if (!confirmLogout) return; // 사용자가 취소하면 로그아웃 실행 안 함

  try {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/"; // 로그아웃 후 로그인 페이지로 이동
  } catch (error) {
    console.error("❌ 로그아웃 실패:", error);
  }
});


  const clientCodeInput = document.getElementById("clientCode");
  const historyCheckbox = document.getElementById("useHistory");
  const keepHistoryCheckbox = document.getElementById("keepHistory");
  const historyNumberInput = document.getElementById("historyNumber");
  const barcodeInput = document.getElementById("barcodeInput");
  const orderTypeOut = document.querySelector("input[name='orderType'][value='출고']");
  const returnTypeNormal = document.querySelector("input[name='returnType'][value='정상']");
  const multiSelectCheckbox = document.getElementById("multiSelect");
  const dataTable = document.getElementById("dataTable");

  // ✅ 입력 필드에 포커스되었을 때 전체 텍스트 자동 선택
  const autoSelectOnFocus = (inputElement) => {
      inputElement.addEventListener("focus", (event) => {
          event.target.select();
      });
  };

  // 적용할 입력 필드 리스트
  const inputFields = [clientCodeInput, historyNumberInput, barcodeInput];

  // 각 입력 필드에 이벤트 리스너 적용
  inputFields.forEach(autoSelectOnFocus);

  // ✅ 기본적으로 "출고" & "정상" 라디오 버튼 체크
  if (orderTypeOut) orderTypeOut.checked = true;
  if (returnTypeNormal) returnTypeNormal.checked = true;

  function setActiveInput() {
      barcodeInput.disabled = false;
      if (!historyCheckbox.checked) {
          historyNumberInput.disabled = true;
          keepHistoryCheckbox.disabled = true;
          historyNumberInput.value = "";
          keepHistoryCheckbox.checked = false;
      } else {
          historyNumberInput.disabled = false;
          keepHistoryCheckbox.disabled = false;
      }
  }

  // ✅ 거래처 코드 입력란에서 엔터 누르면 다음 필드로 이동 (값 없으면 경고)
  clientCodeInput.addEventListener("input", (event) => {
      clientCodeInput.value = clientCodeInput.value.replace(/\D/g, '').slice(0, 4); // 숫자만 입력 허용
  });

  clientCodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();

          let value = clientCodeInput.value.trim();

          if (!value) {
              alert("거래처 코드를 입력하세요.");
              clientCodeInput.focus();
              return;
          }

          if (value.length < 4) {
              clientCodeInput.value = value.padStart(4, "0"); // 4자리로 변환
          }
          
          setActiveInput();
          if (historyCheckbox.checked) {
              historyNumberInput.focus();
          } else {
              barcodeInput.focus();
          }
      }
  });

  historyNumberInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          barcodeInput.focus();
      }
  });

  barcodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && barcodeInput.value.trim() !== "") {
          event.preventDefault();
          insertBarcodeIntoTable(barcodeInput.value.trim());
          barcodeInput.value = "";
          if (!historyCheckbox.checked || keepHistoryCheckbox.checked) {
              barcodeInput.focus();
          } else {
              historyNumberInput.focus();
          }
      }
  });

  document.getElementById("addBarcode").addEventListener("click", () => {
      if (!barcodeInput.value.trim()) {
          alert("바코드를 입력하세요.");
          return;
      }
      insertBarcodeIntoTable(barcodeInput.value.trim());
      barcodeInput.value = "";
  });

  function insertBarcodeIntoTable(barcode) {
      if (!clientCodeInput.value.trim()) {
          alert("거래처 코드를 입력하세요.");
          clientCodeInput.focus();
          return;
      }

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td>제품명</td>
          <td>등급</td>
          <td>중량</td>
          <td>${barcode}</td>
      `;
      dataTable.appendChild(newRow);
  }

  historyCheckbox.addEventListener("change", setActiveInput);
  keepHistoryCheckbox.addEventListener("change", setActiveInput);

  window.onload = setActiveInput;

  // ✅ 테이블 행 선택 기능 (다중 선택 여부 확인)
  dataTable.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (!row || row.parentNode.tagName !== "TBODY") return;

      if (multiSelectCheckbox.checked) {
          row.classList.toggle("selected");
      } else {
          dataTable.querySelectorAll(".selected").forEach(r => r.classList.remove("selected"));
          row.classList.add("selected");
      }
  });

  // ✅ 제품 삭제 기능 (삭제 확인 메시지 추가)
  document.getElementById("deleteProduct").addEventListener("click", () => {
      const selectedRows = document.querySelectorAll("#dataTable .selected");

      if (selectedRows.length === 0) {
          alert("삭제할 제품을 선택하세요.");
          return;
      }

      const confirmDelete = confirm("정말 삭제하시겠습니까?");
      if (confirmDelete) {
          selectedRows.forEach(row => row.remove());
      }
  });
});
