const root = document.getElementById("root");

const StagesEnum = {
  Started: "Started",
  Doing: "Doing",
  Testing: "Testing",
  Reviewing: "Reviewing",
  Done: "Done",
};
const stages = _.keys(StagesEnum);

const tasks1 = [
  {
    title: "Primeira Tarefa",
    points: 100,
    description: "Hello world",
    createdAt: new Date(2021, 7, 2, 14, 5, 12),
    updatedAt: new Date(2021, 7, 2, 14, 9, 37),
    stage: "Started",
  },
  {
    title: "Primeira Tarefa",
    points: 100,
    description: "Hello world",
    createdAt: new Date(2021, 7, 2, 14, 5, 12),
    updatedAt: new Date(2021, 7, 2, 14, 9, 37),
    stage: "Doing",
  },
  {
    title: "Primeira Tarefa",
    points: 100,
    description: "Hello world",
    createdAt: new Date(2021, 7, 2, 14, 5, 12),
    updatedAt: new Date(2021, 7, 2, 14, 9, 37),
    stage: "Testing",
  },
  {
    title: "Primeira Tarefa",
    points: 100,
    description: "Hello world",
    createdAt: new Date(2021, 7, 2, 14, 5, 12),
    updatedAt: new Date(2021, 7, 2, 14, 9, 37),
    stage: "Reviewing",
  },
  {
    title: "Primeira Tarefa",
    points: 100,
    description: "Hello world",
    createdAt: new Date(2021, 7, 2, 14, 5, 12),
    updatedAt: new Date(2021, 7, 2, 14, 9, 37),
    stage: "Done",
  },
];
const tasks = tasks1.concat(tasks1).concat(tasks1);

function buildTasks(tasks) {
  const pairs = tasks.map((task) => [task.stage, task]);
  const [validPairs, invalidPairs] = _.partition(
    pairs,
    (p) => !!StagesEnum[p[0]]
  );

  if (invalidPairs.length > 0) {
    console.warn("Invalid tasks was founded!", invalidPairs);
  }

  const tasksMap = validPairs.reduce((obj, [stage, task]) => {
    obj[stage] = obj[stage] || [];
    obj[stage].push(task);
    return obj;
  }, {});
  const container$ = hdiv();

  const data = [];
  const header = [];
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const stageTasks = tasksMap[stage];

    header.push(
      htag("th", {
        children: [
          hdiv({
            className: "p-3 bg-primary text-light text-center rounded",
            children: htext(stage),
          }),
        ],
      })
    );

    data[i] = data[i] || [];
    stageTasks.forEach((task) => {
      data[i].push(
        htag("td", {
          children: hdiv({
            className: "text-dark",
            children: [
              hdiv({
                children: [
                  htext(task.title),
                  hspan(task.points, {
                    className: "badge badge-light float-sm-right",
                  }),
                ],
              }),
              hdiv({
                style: "font-size: 0.9rem;",
                className: "text-muted",
                children: htext("Criado em: " + formatDate(task.createdAt)),
              }),
              hdiv({
                style: "font-size: 0.9rem;",
                className: "text-muted",
                children: htext("Atualizado em: " + formatDate(task.updatedAt)),
              }),
            ],
          }),
        })
      );
    });
  }

  const body = transpose(data).map((row) => htag("tr", { children: row }));
  const head = htag("tr", { children: header });
  container$.appendChild(
    htag("table", {
      className: "table",
      children: [
        htag("thead", { children: head }),
        htag("tbody", { children: body }),
      ],
    })
  );

  return container$;
}

const content = hdiv({
  className: "content",
  children: buildTasks(tasks),
});

root.appendChild(content);
