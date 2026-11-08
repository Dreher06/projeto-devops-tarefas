const http = require('node:http');

function createApp() {
  const tarefas = new Map();
  let proximoId = 1;

  function responder(res, status, dados) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(dados));
  }

  async function receberJson(req) {
    const partes = [];
    let tamanho = 0;
    for await (const parte of req) {
      tamanho += parte.length;
      if (tamanho > 1024 * 1024) {
        const erro = new Error('Corpo da requisição muito grande');
        erro.status = 413;
        throw erro;
      }
      partes.push(parte);
    }
    try {
      const dados = JSON.parse(Buffer.concat(partes).toString('utf8'));
      if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) throw new Error();
      return dados;
    } catch {
      const erro = new Error('JSON inválido');
      erro.status = 400;
      throw erro;
    }
  }

  return http.createServer(async (req, res) => {
    const caminho = new URL(req.url, 'http://localhost').pathname;
    const match = /^\/tarefas\/(\d+)$/.exec(caminho);
    const id = match ? Number(match[1]) : null;
    try {
      if (req.method === 'GET' && caminho === '/health') return responder(res, 200, { status: 'ok' });
      if (req.method === 'GET' && caminho === '/tarefas') return responder(res, 200, [...tarefas.values()]);
      if (req.method === 'POST' && caminho === '/tarefas') {
        const dados = await receberJson(req);
        if (typeof dados.titulo !== 'string' || !dados.titulo.trim()) return responder(res, 400, { erro: 'Título obrigatório' });
        const tarefa = { id: proximoId++, titulo: dados.titulo.trim(), concluida: false };
        tarefas.set(tarefa.id, tarefa);
        return responder(res, 201, tarefa);
      }
      if (match && req.method === 'GET') {
        const tarefa = tarefas.get(id);
        return tarefa ? responder(res, 200, tarefa) : responder(res, 404, { erro: 'Tarefa não encontrada' });
      }
      if (match && req.method === 'PUT') {
        const tarefa = tarefas.get(id);
        if (!tarefa) return responder(res, 404, { erro: 'Tarefa não encontrada' });
        const dados = await receberJson(req);
        if (typeof dados.titulo !== 'string' || !dados.titulo.trim() || typeof dados.concluida !== 'boolean') return responder(res, 400, { erro: 'Informe título e concluida (booleano)' });
        const atualizada = { id, titulo: dados.titulo.trim(), concluida: dados.concluida };
        tarefas.set(id, atualizada);
        return responder(res, 200, atualizada);
      }
      if (match && req.method === 'DELETE') {
        if (!tarefas.delete(id)) return responder(res, 404, { erro: 'Tarefa não encontrada' });
        res.writeHead(204); return res.end();
      }
      return responder(res, 404, { erro: 'Rota não encontrada' });
    } catch (erro) {
      return responder(res, erro.status || 500, { erro: erro.status ? erro.message : 'Erro interno' });
    }
  });
}

module.exports = { createApp };
