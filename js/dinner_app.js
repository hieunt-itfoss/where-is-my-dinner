"use strict";

let timeElements = [];
const dayInMins = 1440;

const scheduleButton = document.getElementById("setTimer");

// Initialize scheduleTime that stores user input time
let scheduleTime = new Date().setHours(13, 30, 0, 0);

// -------------- FORM --------------
function openForm() {
  chrome.tabs.create({ url: "http://goo.gl/enElea" });
}

// -------------- ALARM --------------
function createAlarm(name, when, period) {
  chrome.alarms.create(name, {
    when: when,
    periodInMinutes: period,
  });
}

function clearAlarm(alarmName) {
  chrome.action.setBadgeText({ text: "" });
  chrome.alarms.clear(alarmName);
}

function clearAllAlarms() {
  chrome.alarms.clearAll();
}

// -------------- SCHEDULER --------------
async function updateScheduleTime() {
  // Parse time elements from input-value
  timeElements = document.getElementById("appt").value.split(":");

  try {
    // Set new time value for reminder
    scheduleTime = new Date().setHours(timeElements[0], timeElements[1], 0, 0);

    // Clear the older alarm if it exists
    clearAlarm("dinner");

    // Set an alarms trigger on scheduled timestamps
    createAlarm("dinner", scheduleTime, dayInMins);

    // Update button value to indicate that the alarm has been set
    scheduleButton.innerText = "Update Success";

  } catch (e) {
    console.log(e);
  } finally {
    // Change the button value to default after 2 sec
    // TODO: Apply dynamic content for button value
    await delay(2000);
    scheduleButton.innerText = "Set schedule time";
  }
}

// -------------- EVENT TRIGGER --------------
document.getElementById("quickOpen").addEventListener("click", openForm);
scheduleButton.addEventListener("click", updateScheduleTime);
document
  .getElementById("clearAlarm")
  .addEventListener("click", clearAlarm("dinner"));
