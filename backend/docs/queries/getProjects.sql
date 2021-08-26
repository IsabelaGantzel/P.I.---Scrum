SELECT COUNT(s.id) as sprint_count, s.final_date as sprint_final_date, p.*
FROM person_projects p
LEFT JOIN (
	SELECT DISTINCT s.id
	FROM projects p2 
	JOIN tasks t ON t.project_id = p2.id 
	JOIN sprint_tasks st ON st.task_id = t.id
	JOIN sprints s ON s.id = st.sprint_id 
) as s
WHERE p.person_id = 4
GROUP BY p.id;
