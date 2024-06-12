const cron = require("node-cron");
const logtail = require("../setup/logtail");

module.exports.startCronJobs = () => {
  try {
    console.log('connect')
    // cron.schedule("0 * * * *");
  } catch (error) {
    logtail.error(`Chron Job schedulur: ${error.message}`, {
      path: "Chron job scheduler",
      method: "PUT",
      status: 500,
    });
  }
};
