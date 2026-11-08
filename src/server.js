const { createApp } = require('./app');
const porta = Number(process.env.PORT || 3000);
createApp().listen(porta, '0.0.0.0', () => console.log(`API executando na porta ${porta}`));
