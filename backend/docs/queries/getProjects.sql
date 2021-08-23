SELECT COUNT(s.id) as sprint_count, p.*
FROM person_projects p
LEFT JOIN (
	SELECT DISTINCT s.id
	FROM projects p2 
	LEFT JOIN tasks t ON t.project_id = p2.id 
	LEFT JOIN sprint_tasks st ON st.task_id = t.id
	LEFT JOIN sprints s ON s.id = st.sprint_id 
	WHERE st.sprint_id = s.id
) as s
WHERE p.person_id = 4
GROUP BY p.id;
