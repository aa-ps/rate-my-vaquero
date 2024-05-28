const SCHOOL_LEGACY_ID = 1306;
const SCHOOL_ID = "U2Nob29sLTEzMDY=";
const RMP_API_URL = "https://www.ratemyprofessors.com/graphql";
const SEARCH_TABLE = document.getElementById("searchResultsTable");
const QUERY =
  "query NewSearchTeachersQuery(\n  $query: TeacherSearchQuery!\n  $count: Int\n) {\n  newSearch {\n    teachers(query: $query, first: $count) {\n      didFallback\n      edges {\n        cursor\n        node {\n          id\n          legacyId\n          firstName\n          lastName\n          department\n          departmentId\n          school {\n            legacyId\n            name\n            id\n          }\n          ...CompareProfessorsColumn_teacher\n        }\n      }\n    }\n  }\n}\n\nfragment CompareProfessorsColumn_teacher on Teacher {\n  id\n  legacyId\n  firstName\n  lastName\n  school {\n    legacyId\n    name\n    id\n  }\n  department\n  departmentId\n  avgRating\n  numRatings\n  wouldTakeAgainPercentRounded\n  mandatoryAttendance {\n    yes\n    no\n    neither\n    total\n  }\n  takenForCredit {\n    yes\n    no\n    neither\n    total\n  }\n  ...NoRatingsArea_teacher\n  ...RatingDistributionWrapper_teacher\n}\n\nfragment NoRatingsArea_teacher on Teacher {\n  lastName\n  ...RateTeacherLink_teacher\n}\n\nfragment RatingDistributionWrapper_teacher on Teacher {\n  ...NoRatingsArea_teacher\n  ratingsDistribution {\n    total\n    ...RatingDistributionChart_ratingsDistribution\n  }\n}\n\nfragment RatingDistributionChart_ratingsDistribution on ratingsDistribution {\n  r1\n  r2\n  r3\n  r4\n  r5\n}\n\nfragment RateTeacherLink_teacher on Teacher {\n  legacyId\n  numRatings\n  lockStatus\n}\n";

class ProfessorData {
  constructor({
    avgRating = 0,
    department = "",
    firstName = "",
    id = "",
    lastName = "",
    legacyId = 0,
    numRatings = 0,
    wouldTakeAgainPercentRounded = 0,
  } = {}) {
    this.avgRating = avgRating;
    this.department = department;
    this.firstName = firstName;
    this.id = id;
    this.lastName = lastName;
    this.legacyId = legacyId;
    this.numRatings = numRatings;
    this.wouldTakeAgainPercent = wouldTakeAgainPercentRounded;
  }
}

async function searchProfessor(name) {
  const queryBody = {
    query: QUERY,
    variables: {
      query: {
        text: name,
        schoolID: SCHOOL_ID,
      },
      count: 1,
    },
  };

  const response = await fetch(
    `https://corsproxy.io/?${encodeURIComponent(RMP_API_URL)}`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic dGVzdDp0ZXN0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryBody),
    }
  );

  const { data } = await response.json();
  return new ProfessorData(data?.newSearch.teachers.edges[0]?.node);
}

function getProfessors(searchTable) {
  const professorElements = Array.from(
    searchTable.querySelectorAll('td[data-property="instructor"]')
  );
  return {
    professorElements,
    professorNames: professorElements.map((e) =>
      e.querySelector("a") == null
        ? "NO_PROFESSOR"
        : e.querySelector("a").innerText
    ),
  };
}

function formatName(name) {
  const [firstName, ...restOfName] = name.split(" ");
  const lastName = restOfName.pop();
  return `${firstName} ${lastName}`;
}

function insertRating(professor, professorElement) {
  observer.disconnect();
  if (professorElement.querySelector(".rating")) {
    observer.observe(SEARCH_TABLE, {
      subtree: true,
      childList: true,
    });
    return;
  }

  let { avgRating, numRatings } = professor;
  let percentage = (avgRating / 5) * 100;

  let ratingDisplay = `<div title="${
    numRatings == 0 ? "No Ratings" : avgRating
  }" class="rating">
  <div class="rating-upper" style="width: ${percentage}%">
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span
      <span>★</span>
      <span>★</span>
  </div>
  <div class="rating-lower">
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
  </div>
</div>`;
  professorElement.innerHTML += ratingDisplay;

  observer.observe(SEARCH_TABLE, {
    subtree: true,
    childList: true,
  });
}

async function displayRatings(searchTable) {
  observer.disconnect();
  const { professorElements, professorNames } = getProfessors(searchTable);
  for (let i = 0; i < professorNames.length; i++) {
    const name = formatName(professorNames[i]);
    if (name != "NO_PROFESSOR") {
      const professor = await searchProfessor(name);
      insertRating(professor, professorElements[i]);
      await sleep(500);
    }
  }
  observer.observe(SEARCH_TABLE, { subtree: true, childList: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedDisplayRatings = debounce(displayRatings, 300);

const observer = new MutationObserver(() =>
  debouncedDisplayRatings(SEARCH_TABLE)
);

chrome.storage.sync.get("enabled", ({ enabled }) => {
  if (enabled) {
    observer.observe(SEARCH_TABLE, { subtree: true, childList: true });
  }
});
