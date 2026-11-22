
$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "Baixando a imagem Docker..."
docker compose pull
if ($LASTEXITCODE -ne 0) { throw "Falha no download da imagem." }

Write-Host "Atualizando a aplicacao..."
docker compose up -d
if ($LASTEXITCODE -ne 0) { throw "Falha na implantacao." }

Write-Host "Verificando o container..."
docker compose ps
if ($LASTEXITCODE -ne 0) { throw "Falha na consulta do container." }

Write-Host "Deploy solicitado com sucesso."