export async function fetchCustomerInfo(customerCode) {
  const customerInfoSpan = document.getElementById("customerInfo");

  if (!customerCode) {
      customerInfoSpan.textContent = "";
      return;
  }

  try {
      const response = await fetch(`/customer-info/${customerCode}`);
      if (!response.ok) {
          customerInfoSpan.textContent = "거래처 없음";
          return;
      }

      const data = await response.json();
      customerInfoSpan.textContent = `${data.cust_id} (${data.cust_trade})`;
  } catch (error) {
      console.error("❌ 거래처 정보 불러오기 실패:", error);
      customerInfoSpan.textContent = "오류 발생";
  }
}