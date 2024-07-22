// const { invoke } = window.__TAURI__.tauri;
//
// let greetInputEl;
// let greetMsgEl;
//
// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }
//
// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
//   document.querySelector("#greet-form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     greet();
//   });
// });
const CODE_REGEX = new RegExp("S([1-2]0|31)\\d+");

let code_submit_button = document.querySelector(".codeSubmit");
code_submit_button.addEventListener("click", (e) => {
  let code = document.querySelector(".codeInput").value;
  
  if (CODE_REGEX.test(code)){
    window.location.href = "consent.html";
  }
  else{
    let error_text = document.querySelector(".errorText");

    error_text.style.visibility = "visible";
  }
});
