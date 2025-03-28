const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let res = "";
let upload = document.getElementById("upfile").addEventListener("click", uploadFile);

function uploadFile() {
  let file = document.getElementById("chfile");
  const inp = file.files[0];

  if(!inp){
    alert('Please select a file to upload!')
  }
  
  const reader = new FileReader();

  reader.onload = function (event) {
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const data = event.target.result;
    const timerDuration = 86400;

    localStorage.setItem(
      `${res}`,
      JSON.stringify({
        file: data,
        name: inp.name,
        code: res,
        timer: timerDuration,
      })
    )

    document.getElementById("showCode").value = res;
    startTimer(timerDuration, document.getElementById("timer"), res);
    copyCode();
  };
  reader.readAsDataURL(inp);
}

function startTimer(duration, display, code) {
  let timer = duration;
  const interval = setInterval(() => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);

    display.innerHTML = `Expires in ${hours}h ${minutes}m minutes`;

    if (--timer < 0) {
      clearInterval(interval);
      display.innerHTML = `${code} has expired`;
      localStorage.removeItem(`${code}`);
    }
  }, 1000);
}

let dnload = document.getElementById("dnfile").addEventListener("click", downloadFile);

function downloadFile() {
  let code = document.getElementById("code").value;
  console.log(code);
  let data = JSON.parse(localStorage.getItem(`${code}`));
  console.log(data);
  if (data && data.code === code) {
    let a = document.createElement("a");
    a.href = data.file;
    a.download = `${data.name}`;
    a.click();
  } else {
    alert("File has expired or code is invalid.");
  }
}

function copyCode() {
  document.getElementById("share").addEventListener("click", function () {
    code = document.getElementById("showCode").value;
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          alert("Code copied to clipboard!");
        })
        .catch((err) => {
          alert("Failed to copy code: " + err);
        });
    } else {
      alert("No code to copy!");
    }
  });
}

document.getElementById('code').addEventListener('keypress', function(event) {
  if(event.code === 'Enter'){
    document.getElementById('dnfile').click();
  }
});

document.getElementById('chfile').addEventListener('keypress', function(event){
  let inp = document.getElementById('chfile').file[0];
  if(inp){
    document.activeElement.blur();
  }
  if(event.key === 'Enter'){
    document.getElementById('upfile').click();
  }
});