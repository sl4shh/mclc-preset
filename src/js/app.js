let ramVal = document.getElementById("RamVal");
let ramRange = document.getElementById("RamRange");
let connectedTxt = document.getElementById("LoginStatus");
let avatarImg = document.getElementById("Avatar");
let accountBtn = document.getElementById("Account");
let playBtn = document.getElementById("LaunchGame");
let connected = false;
const Toast = Swal.mixin({
  toast: true,
  position: "top-right",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

ramRange.addEventListener("input", () => {
  ramVal.innerHTML = ramRange.value;
});

function setLoginStatus(isLogged, username) {
  connected = isLogged;
  if (isLogged) {
    connectedTxt.innerHTML = `Connecté sous ${username}`;
    accountBtn.innerHTML = "Déconnexion";
    accountBtn.classList = ["red"];
    playBtn.disabled = false;
  } else {
    connectedTxt.innerHTML = `Déconnecté`;
    accountBtn.innerHTML = "Connexion";
    accountBtn.classList = [];
    playBtn.disabled = true;
  }
}

playBtn.addEventListener("click", () => {

});

setLoginStatus(false, "");

accountBtn.addEventListener("click", () => {
});
