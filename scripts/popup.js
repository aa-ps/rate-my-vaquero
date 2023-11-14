document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggle");

  chrome.storage.sync.get("enabled", ({ enabled }) => (toggleSwitch.checked = enabled));

  toggleSwitch.addEventListener("change", () => {
    const { checked: enabled } = toggleSwitch;
    chrome.storage.sync.set({ enabled });
  });
});
