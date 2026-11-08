const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

async function comServidor(executar) {
  const servidor = createApp();
  await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
  const endereco = `http://127.0.0.1:${servidor.address().port}`;
  try { await executar(endereco); } finally { await new Promise((resolve) => servidor.close(resolve)); }
}

test('health retorna status ok', async () => comServidor(async (url) => {
  const resposta = await fetch(`${url}/health`);
  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), { status: 'ok' });
}));

test('lista inicial está vazia', async () => comServidor(async (url) => {
  const resposta = await fetch(`${url}/tarefas`);
  assert.deepEqual(await resposta.json(), []);
}));

test('cadastrar, consultar, atualizar e excluir tarefa', async () => comServidor(async (url) => {
  const criadaResposta = await fetch(`${url}/tarefas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: 'Estudar DevOps' }) });
  assert.equal(criadaResposta.status, 201);
  const criada = await criadaResposta.json();
  assert.equal(criada.id, 1);
  assert.equal(criada.concluida, false);
  const consulta = await fetch(`${url}/tarefas/1`);
  assert.equal((await consulta.json()).titulo, 'Estudar DevOps');
  const edicao = await fetch(`${url}/tarefas/1`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: 'Entregar trabalho', concluida: true }) });
  assert.equal((await edicao.json()).concluida, true);
  const exclusao = await fetch(`${url}/tarefas/1`, { method: 'DELETE' });
  assert.equal(exclusao.status, 204);
  assert.equal((await fetch(`${url}/tarefas/1`)).status, 404);
}));

test('não aceita título vazio', async () => comServidor(async (url) => {
  const resposta = await fetch(`${url}/tarefas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: ' ' }) });
  assert.equal(resposta.status, 400);
}));

test('responde 404 para tarefa inexistente', async () => comServidor(async (url) => {
  assert.equal((await fetch(`${url}/tarefas/999`)).status, 404);
}));
