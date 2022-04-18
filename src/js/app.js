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
  if (localStorage.getItem("userData")) {
    window.LauncherAPI.LaunchGame(
      2,
      JSON.parse(localStorage.getItem("userData"))
    );
  } else {
    Swal.fire({
      icon: "error",
      title: "Oh tiens une erreur !",
      text: errmsg,
    });
  }
});

setLoginStatus(false, "");

accountBtn.addEventListener("click", () => {
  if (!connected) {
    accountBtn.disabled = true;
    window.LauncherAPI.MicrosoftLogin((err, token) => {
      console.log(err);
      console.log(token);
    });
  } else {
    localStorage.setItem("token", "");
    setLoginStatus(false, "");
  }
});

window.LauncherAPI.MicrosoftConnected((evt, user, mclc) => {
  accountBtn.disabled = false;
  console.log(evt);
  console.log(user);
  console.log(mclc);
  localStorage.setItem("userData", JSON.stringify(mclc));
  setLoginStatus(true, user.name);
  Toast.fire({
    icon: "success",
    title: "Connexion réussie",
  });
});

window.LauncherAPI.ErrorDialog((evt, errmsg) => {
  accountBtn.disabled = false;
  console.log(evt);
  console.log(errmsg);
  Swal.fire({
    icon: "error",
    title: "Oh tiens une erreur !",
    text: errmsg,
  });
});

window.onload = () => {
  if (localStorage.getItem("userData")) {
    window.LauncherAPI.StorageLogin(localStorage.getItem("userData"));
  }
};

window.LauncherAPI.StorageConnected((evt, user) => {
  accountBtn.disabled = false;
  console.log(evt);
  console.log(user);
  setLoginStatus(true, user.name);
  Toast.fire({
    icon: "success",
    title: "Connexion réussie",
  });
});
