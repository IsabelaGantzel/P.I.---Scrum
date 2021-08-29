const db = require("../src/database");

async function run() {
  const tasks = await db.query
    .select("t.*", "sg.name as stage")
    .from({ t: "tasks" })
    .join({ st: "sprint_tasks" }, "st.task_id", "=", "t.id")
    .join({ sg: "stages" }, "sg.id", "=", "st.stage_id");

  console.log(tasks);
}

run();
