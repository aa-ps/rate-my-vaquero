document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggle");

  const updateStatus = (enabled) => {
    toggleSwitch.checked = enabled;
  };

  chrome.storage.local.get("enabled", ({ enabled }) => updateStatus(enabled));

  toggleSwitch.addEventListener("change", () => {
    const { checked: enabled } = toggleSwitch;
    updateStatus(enabled);
    chrome.storage.local.set({ enabled });
  });
});
