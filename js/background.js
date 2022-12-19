"use strict";

let defaultTimer;
let newDate;
let isClick = true;

function checkResetStateAlarm(callback) {
  chrome.alarms.getAll(function (alarms) {
    var hasAlarm = alarms.some(function (a) {
      return a.name == "resetState";
    });

    var newLabel;
    if (hasAlarm && new Date().getHours() === new Date(newDate).getHours) {
      newLabel = "Reset Click: activated";
    } else {
      newLabel = "Reset Click: deactivated";
    }
    console.log("Reset date: ", new Date(newDate));
    console.log(newLabel);

    if (callback) callback(hasAlarm);
  });
}

// Listeners must be registered synchronously from the start of the page.
// DO NOT register listeners asynchronously, as they will not be properly triggered.
// Ref to the document: https://developer.chrome.com/docs/extensions/mv2/background_pages/#listeners

// Initialize alarm with defaultTimer and newDate at the first time when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("lastChanceToOrder", {
    when: defaultTimer,
    periodInMinutes: 1440,
  });
  chrome.alarms.create("resetState", { when: newDate, periodInMinutes: 1440 });

  // Set defaultTimer value to make sure users don't miss the lastChanceToOrder event
  // 5mins before the Ragnarok
  defaultTimer = new Date().setHours(14, 55, 0, 0);

  // Set newDate value to reset the click state
  newDate = new Date().setHours(6, 0, 0, 0) + 24 * 60 * 60 * 1000;

  // Initialize clicking state of user which is used to track user's event click on notification banner.
  isClick = true;
});

// Handle the trigger event => pop-up notification
chrome.alarms.onAlarm.addListener(() => {
  let isResetState = checkResetStateAlarm();

  // Check if alarm is `resetState` and reset Clicking state if isClick was true
  if (isResetState) {
    if (isClick) {
      isClick = false;
    }
  } else {
    // Check if current day is weekday
    if (new Date().getDay() % 6 != 0) {
      console.log("Click state: " + isClick + " | Timestamp: " + new Date());

      if (!isClick) {
        // Force open the Order form if the first notification is ignored by users
        chrome.tabs.create({ url: "http://goo.gl/enElea" });
        isClick = true;
      } else {
        // Set notification
        chrome.action.setBadgeText({ text: "ON" });
        chrome.notifications.create("dinner", {
          type: "basic",
          iconUrl: "../hot-pot-128.png",
          title: "Your dinner incoming...",
          message: "Please make your choice\nhttp://goo.gl/enElea",
          buttons: [{ title: "Link" }],
          priority: 0,
        });
      }
    }
  }
});

// Handle notification onClick event => open Form and update click state
chrome.notifications.onClicked.addListener(async () => {
  isClick = true;
  chrome.tabs.create({ url: "http://goo.gl/enElea" });
  chrome.notifications.clear("dinner");
});

// Handle savedScheduleTime onChanged event
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(["savedScheduleTime"]).then((result) => {
    console.log("ScheduleTime currently is " + result.key);
  });
});
