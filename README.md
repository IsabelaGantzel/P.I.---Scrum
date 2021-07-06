# **Gerenciador Scrum**

Neste projeto, desejamos criar um gerenciador SCRUM semelhante ao ZenHub.
Suas funcionalidades vão ser parecidas com as do ZenHub, porém algumas coisas vão ser ignoradas para futuras atualizações.

O SCRUM é um framework para desenvolver, entregar e manter produtos complexos.
Seu fluxo depende de várias atividades de acompanhamento e gerenciamento, além de maneiras para avaliar as tarefas atuais.

Algumas funcionalidades desejadas são:

* Listagem do backlog do produto.
* Acompanhamento da sprint atual
* Atualização das atividades da sprint atual

## **Estruturação Base**

A estruturação básica desejada é a seguinte.

OBS: É destacado em negrito as características principais.

* Lista de projetos
* Software
  * Lista de sprints
  * **Backlog do produto**
  * **Sprint atual**
  * **Backlog da sprint**
  * Sprint
    * **Dentro das sprints ver o “andamento” do projeto**
    * Visualização de relatórios: Burndown, burnup…

## **Modelos**

Possível estruturas dos modelos necessário.

OBS: Não representam a versão final.

**Cliente**: ...

**Backlog do produto/sprint**: Lista de tarefas, com características e funcionalidades que o sistema deve implementar.
* Quais atributos um item do backlog precisa ter?
  * Data de criação
  * Data de atualização
  * Labels              (“Bug” | “Feature” | "Design")
  * Descrição
  * Pontuação           (Estimativa de esforço)
  * Fase do Pipeline    (“Started” | “Doing” | “Testing” | “Reviewing” | “Done”)
  * Id da Sprint: Nullable

**História do usuário**:
* Quais os atributos de uma história do usuário?
  * Título
  * Descrição
  * Pontuação (Estimativa de esforço)
  * Id da Sprint: Nullable

**Sprint**: Possui uma duração fixa e curta, possui um backlog próprio para ser cumprido.
* Duração mínima de 1 semana e máxima de 1 mês.
* Posso retroceder um fluxo da sprint? (Ex: Feito -> Andamento -> A fazer)
* Possível fluxo: A fazer -> Andamento -> (Revisão -> Teste ?) -> Feito
* Quais os atributos de uma sprint?
  * Data de criação
  * Data de atualização
  * Duração (Data de término)

## **Tecnologias**

Pretendemos utilizar as seguintes tecnologias:

OBS: Não representam a versão final.

* Front-end: JS, CSS e HTML.
* Backend: Node JS, Express, Typescript.

## **Inicializando o projeto**

!TODO

## Integrações

* Integrar os prazos com o calendário do google.
