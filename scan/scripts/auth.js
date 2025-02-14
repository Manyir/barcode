export async function checkUserAuth() {
  try {
      const response = await fetch("/user-info");
      if (!response.ok) {
          window.location.href = "/";
          return;
      }
      const data = await response.json();
      document.getElementById("username-display").innerText = `사용자: ${data.username}`;
  } catch (error) {
      console.error("❌ 사용자 정보 로드 실패:", error);
      window.location.href = "/";
  }
}

export async function logout() {
  const confirmLogout = confirm("정말 로그아웃 하시겠습니까?");
  if (!confirmLogout) return;

  try {
      await fetch("/logout", { method: "POST" });
      window.location.href = "/";
  } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
  }
}
