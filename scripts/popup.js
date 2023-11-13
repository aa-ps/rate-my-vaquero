document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggle");

  chrome.storage.local.get("enabled", ({ enabled }) => (toggleSwitch.checked = enabled));

  toggleSwitch.addEventListener("change", () => {
    const { checked: enabled } = toggleSwitch;
    chrome.storage.local.set({ enabled });
  });
});
