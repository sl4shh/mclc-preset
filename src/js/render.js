let accountBtn = document.getElementById("Account");

accountBtn.addEventListener("click", () => {
  window.LauncherAPI.MicrosoftLogin((err, token) => {});
});
