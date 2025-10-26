const fetch = require('node-fetch');

async function getEndpoints() {
  try {
    const response = await fetch('http://localhost:5001/api/endpoints');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur:', error);
  }
}

getEndpoints();