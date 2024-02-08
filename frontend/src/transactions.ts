import { client, validateAuth } from "./apiClient";

validateAuth();

document.addEventListener("DOMContentLoaded", async () => {
  const transactions = await client.get("wallet/statement");
  const statementList = document.getElementById("statement");
  transactions.data.forEach((transaction: any) => {
    const transactionElement = document.createElement("li");
    transactionElement.innerHTML = `
      <b>${transaction.isCredit ? "+" : "-"} ${transaction.currency} ${
      transaction.amount
    } ${transaction.createdAt}<b/>
    `;
    statementList.appendChild(transactionElement);
  });
});
