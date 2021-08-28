async function storeProject({
  // ARGS
  projectName,
  managerPersonId,
  clientPersonId,
  devIds,
  startDate,
  // SELECT
  getClientByPersonId,
  getManagerByPersonId,
  // INSERT INTO
  storeProjectInDatabase,
  storeDevsInDatabase,
}) {
  const managerId = await getManagerByPersonId(managerPersonId);
  const clientId = await getClientByPersonId(clientPersonId);
  const projectData = {
    name: projectName,
    start_date: startDate,
    final_date: null,
    manager_id: managerId,
    client_id: clientId,
  };

  const projectId = await storeProjectInDatabase(projectData);

  const devs = devIds.map((personId) => {
    return {
      project_id: projectId,
      person_id: personId,
    };
  });
  await storeDevsInDatabase(devs);

  return {
    id: projectId,
    ...projectData,
    devs,
  };
}

module.exports = storeProject;
