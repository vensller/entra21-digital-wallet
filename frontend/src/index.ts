import { client } from "./apiClient";

document
  .getElementById("form")
  ?.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    const credentials = await client.post("/login", {
      email: (document.getElementById("email") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value,
    });
    localStorage.setItem("token", credentials.data.token);
    window.location.replace("/html/transactions.html");
  });
