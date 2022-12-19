chrome.runtime.sendMessage({ popupOpen: true });

chrome.storage.local.get(["savedScheduleTime"], (result) => {
  if (typeof result.savedScheduleTime !== "undefined") {
    document.getElementById("currentTime").innerHTML =
      "Prev Alarm: " + new Date(result.savedScheduleTime.timeString).toTimeString();
  } else {
    console.log(result)
  }
});
