const db = require('../db/db');

(async () => {
  try {
    console.log('Running admin summary queries...');
    const [[donors]] = await db.query("SELECT COUNT(*) AS totalDonors FROM Donors");
    console.log('donors:', donors);
    const [[recipients]] = await db.query("SELECT COUNT(*) AS totalRecipients FROM Recipients");
    console.log('recipients:', recipients);
    const [[organs]] = await db.query("SELECT COUNT(*) AS totalOrgans FROM Organs");
    console.log('organs:', organs);
    const [[matches]] = await db.query("SELECT COUNT(*) AS totalMatches FROM Matches");
    console.log('matches:', matches);
    console.log('Summary assembled:', {
      totalDonors: donors?.totalDonors || 0,
      totalRecipients: recipients?.totalRecipients || 0,
      totalOrgans: organs?.totalOrgans || 0,
      totalMatches: matches?.totalMatches || 0,
    });
    process.exit(0);
  } catch (err) {
    console.error('TEST ADMIN SUMMARY ERROR:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
