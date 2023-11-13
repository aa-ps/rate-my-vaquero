class ProfessorData {
  constructor(data) {
    this.typename = data.__typename;
    this.avgDifficulty = data.avgDifficulty;
    this.avgRating = data.avgRating;
    this.department = data.department;
    this.firstName = data.firstName;
    this.id = data.id;
    this.lastName = data.lastName;
    this.legacyId = data.legacyId;
    this.numRatings = data.numRatings;
    this.wouldTakeAgainPercent = data.wouldTakeAgainPercent;
  }
}

function displayProfessorRatings(mutationList, observer) {
  const instructors = [
    ...document.querySelectorAll(`td[data-property="instructor"] a`),
  ]
    .map((e) => e.innerText)
    .forEach((name) => {
      const [firstName, ...restOfName] = name.split(" ");
      const lastName = restOfName.pop();
      console.log(`${firstName} ${lastName}`);
    });
}

// https://stackoverflow.com/questions/38881301/
function waitForAddedNode({ id, parent, recursive, done }) {
  const observer = new MutationObserver(() => {
    const element = document.getElementById(id);
    if (element) {
      observer.disconnect();
      done(element);
    }
  });
  observer.observe(parent, {
    subtree: recursive || !parent,
    childList: true,
  });
}

const SCHOOL_LEGACY_ID = 1306;
const SCHOOL_ID = "U2Nob29sLTEzMDY=";
const RMP_API_URL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=";
const RMP_GRAPHQL = "https://www.ratemyprofessors.com/graphql";
const COURSE_TABLE = document.querySelector("#searchResults");

chrome.storage.local.get("enabled", function (data) {
  if (data.enabled) {
    waitForAddedNode({
      id: "table1",
      parent: COURSE_TABLE,
      recursive: false,
      done: () => {
        displayProfessorRatings();
      },
    });
  }
});
