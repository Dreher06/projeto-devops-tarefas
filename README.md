# DevOps na Prática — Fase 1

Projeto acadêmico de uma API REST de tarefas com Node.js, testes automatizados, GitHub Actions e Terraform + Docker.

## Requisitos
- Node.js 22 ou superior
- Git e conta GitHub
- Para provisionamento local: Docker Desktop em execução e Terraform instalado

## Executar localmente
```bash
npm test
npm start
```
A API escuta na porta 3000. Dados são mantidos apenas em memória, desaparecendo ao reiniciar o servidor.

## Endpoints
| Método | Rota | Ação |
|---|---|---|
| GET | /health | Verificar saúde da API |
| GET | /tarefas | Listar tarefas |
| POST | /tarefas | Criar tarefa: `{"titulo":"Estudar DevOps"}` |
| GET | /tarefas/1 | Consultar uma tarefa |
| PUT | /tarefas/1 | Atualizar: `{"titulo":"Estudar","concluida":true}` |
| DELETE | /tarefas/1 | Excluir |

## Integração contínua
O workflow `.github/workflows/ci.yml` é acionado por push, pull request e execução manual. Executa verificação de sintaxe, 5 testes automatizados e `terraform fmt`, `init` e `validate`. **Não faz deploy automaticamente**.

## Provisionamento local com Terraform
Com Docker Desktop ativo:
```bash
cd terraform
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
```
A API estará em `http://localhost:3000/health`. Para remover os recursos: `terraform destroy`.

Observação: Terraform valida os scripts no CI, mas o provisionamento real deve ser realizado localmente em uma máquina com Docker funcionando. O uso do Docker Provider 4.6.0 exige um ambiente Docker compatível; caso haja erros de Buildx, verifique as configurações de build do Docker Desktop.

## Evidências recomendadas para o trabalho
1. Página principal do repositório com os arquivos.
2. Execução bem-sucedida do workflow na aba Actions.
3. Logs dos testes automatizados.
4. Arquivos Terraform e, se executado localmente, resultado de `terraform apply` e `/health`.

## Planejamento
**Objetivo:** demonstrar integração contínua, testes automatizados e infraestrutura como código com uma API pequena e reproduzível.

**Requisitos funcionais:** cadastrar, listar, consultar, atualizar e excluir tarefas; disponibilizar rota de saúde.

**Requisitos não funcionais:** Node.js 22+, testes automáticos, CI no GitHub Actions, versionamento Git, contêiner Docker, IaC Terraform, acesso HTTP na porta 3000.

**Plano CI:** push/PR → checkout → configurar Node → validar sintaxe → executar testes; em job separado: instalar Terraform → verificar formatação → inicializar provedores → validar configuração.

**Infraestrutura:** runner Ubuntu hospedado pelo GitHub para CI; Docker Desktop e Terraform para a execução da API provisionada localmente; imagem `node:24-alpine`, contêiner exposto na porta 3000. Nenhuma conta de nuvem paga é necessária.

**Repositório:** adicione aqui a URL real após publicar no GitHub.
