const URL = "http://localhost:3000/api/payment";
let count = 0;
const TOTAL = 200; 
const TOKEN = ""; 

async function spam() {
  for (let i = 1; i <= TOTAL; i++) {
    console.log(`🚀 Enviando requisição #${i}`);
    fetch(URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": TOKEN
      },
      body: JSON.stringify({
        amount: Math.floor(Math.random() * 1000) + 1,
        description: "Teste rate limiter"
      })
    })
      .then(res => res.json())
      .then(data => console.log(`✅ Resposta #${i}:`, data))
      .catch(err => console.error(`❌ Erro #${i}:`, err));
  }
}

spam();
