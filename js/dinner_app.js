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
    document.getElementById("appt").value = new Date(scheduleTime)
      .toTimeString()
      .slice(0, 5);

    document.getElementById("currentTime").innerHTML =
      "Current Alarm: " + new Date(scheduleTime).toTimeString();

    // Save the scheduleTime to chrome local storage
    const value = { timeString: scheduleTime };

    chrome.storage.local.set({ savedScheduleTime: value }, () => {
      if (chrome.runtime.lastError) console.log("Error setting");
    });

    // Update button value to indicate that the alarm has been set
    setTimeout(function () {
      scheduleButton.innerText = "Set Alarm";
    }, 3000); //delay is in milliseconds
  } catch (e) {
    console.log(e);
  } finally {
    scheduleButton.innerText = "Updated!";
  }
}

// -------------- EVENT TRIGGER --------------
document.getElementById("quickOpen").addEventListener("click", openForm);
scheduleButton.addEventListener("click", updateScheduleTime);
document
  .getElementById("clearAlarm")
  .addEventListener("click", clearAlarm("dinner"));
