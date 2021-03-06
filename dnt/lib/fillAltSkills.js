/**
 * Finds all the alt skills and fills it into data object.
 * Returns the found skill ids.
 *
 * @param connection the jdbc connection
 * @param job the job object
 * @param ext the ext data object
 * @param altSkillIds the list of alternative skill ids
 * @returns []
 */
function fillAltSkills(connection, job, ext, altSkillIds) {
  if (!altSkillIds.length) { // no alts were provided
    return [];
  }

  const startTime = System.currentTimeMillis();
  print("    fillAltSkills(${job.ascendancies[2].slug}) - started");

  const altSkillIdsStr = altSkillIds.join(',');
  const query = sqls['get-alt-skills.prepared.sql'].replace('(?)', "(${altSkillIdsStr})");
  const pstmt = connection.prepareStatement(query);

  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  const skillIds = [];
  const rs = pstmt.executeQuery();

  while (rs.next()) {
    const skill = mapSkill(rs, job, ext);

    job.messages.push(skill.name);
    job.skills[skill.id] = skill;

    skillIds.push(skill.id);
  }

  pstmt.close();

  const durationTime = System.currentTimeMillis() - startTime;
  print("    fillAltSkills(${job.ascendancies[2].slug}) - completed in ${durationTime} ms");

  return skillIds;
}