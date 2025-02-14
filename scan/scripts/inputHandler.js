import { insertBarcodeIntoTable } from "./dataTable.js";
import { fetchCustomerInfo } from "./api.js";

export function setupInputHandlers() {
    const customerCodeInput = document.getElementById("customerCode");
    const historyCheckbox = document.getElementById("useHistory");
    const keepHistoryCheckbox = document.getElementById("keepHistory");
    const historyNumberInput = document.getElementById("historyNumber");
    const barcodeInput = document.getElementById("barcodeInput");

    // 입력 필드 포커스 시 전체 선택
    [customerCodeInput, historyNumberInput, barcodeInput].forEach(input => {
        input.addEventListener("focus", () => input.select());
    });

    // 거래처 코드 입력 후 포커스 이동
    customerCodeInput.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            let customerCode = customerCodeInput.value.trim();

            if (!customerCode) {
                alert("거래처 코드를 입력하세요.");
                customerCodeInput.focus();
                return;
            }

            if (customerCode.length < 4) {
                customerCode = customerCode.padStart(4, "0");
                customerCodeInput.value = customerCode;
            }

            await fetchCustomerInfo(customerCode);

            setTimeout(() => {
                if (historyCheckbox.checked) {
                    historyNumberInput.focus();
                } else {
                    barcodeInput.focus();
                }
            }, 0);
        }
    });

    // 이력번호 입력 후 바코드로 포커스 이동
    historyNumberInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            barcodeInput.focus();
        }
    });

    // 바코드 입력 후 엔터 시 데이터 추가 + 포커스 이동 처리
    barcodeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const barcode = barcodeInput.value.trim();
            if (!barcode) return;

            insertBarcodeIntoTable(barcode);
            barcodeInput.value = ""; // 입력 후 초기화

            if (historyCheckbox.checked) {
                if (keepHistoryCheckbox.checked) {
                    barcodeInput.focus(); // 고정 체크 시 바코드 유지
                } else {
                    // 이력번호 입력 필드가 비어있다면 바코드 필드 유지
                    if (historyNumberInput.value.trim() === "") {
                        barcodeInput.focus();
                    } else {
                        historyNumberInput.value = ""; // 기존 이력번호 초기화
                        setTimeout(() => historyNumberInput.focus(), 0); // 이력번호 필드로 포커스 이동
                    }
                }
            } else {
                barcodeInput.focus(); // 이력번호 사용 안 하면 바코드 유지
            }
        }
    });
}
