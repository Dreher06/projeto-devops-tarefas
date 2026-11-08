terraform {
  required_version = ">= 1.5.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "4.6.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "api" {
  name = "devops-tarefas:local"
  build {
    context = "${path.module}/.."
  }
  triggers = {
    source_sha1 = sha1(join("", [for f in fileset("${path.module}/..", "src/**") : filesha1("${path.module}/../${f}")]))
  }
}

resource "docker_container" "api" {
  name  = "devops-tarefas"
  image = docker_image.api.image_id
  ports {
    internal = 3000
    external = var.porta_externa
  }
}
