function displayProfessorRatings() {
  const messageElement = document.createElement("div");
  messageElement.textContent = "Professor Ratings: 4.5 / 5";
  messageElement.style.backgroundColor = "yellow";
  messageElement.style.padding = "10px";
  messageElement.style.fontWeight = "bold";

  const courseRegistrationPage = document.querySelector(
    "your-selector-for-course-registration-page"
  );
  courseRegistrationPage.appendChild(messageElement);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enable") {
    displayProfessorRatings();
  } else if (message.action === "disable") {
  }
});

chrome.storage.local.get("enabled", function (data) {
  if (data.enabled) {
    displayProfessorRatings();
  }
});
