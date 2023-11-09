function displayProfessorRatings() {
  let instructors = document.querySelectorAll(`td[data-property="instructor"]`);
  if (instructors.length > 0) {
    let searchInstructor =
      "https://www.ratemyprofessors.com/search/professors/1306?q=";
    instructors = Array.from(instructors).map(
      (e) => e.querySelector("a").innerText
    );
    for (let instructor of instructors) {
      const splitName = instructor.split(" ");
      const firstName = splitName[0];
      const lastName = splitName[splitName.length - 1];
      console.log(`${firstName}%20${lastName}`);
    }
  }
}

const schoolNum = 1306;
const schoolID = btoa(`School-${schoolNum}`);
const API_URL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=";
const GRAPHQL = "https://www.ratemyprofessors.com/graphql";

const teacherStruct = {
  __typename: "",
  avgDifficulty: 0,
  avgRating: 0,
  department: "",
  firstName: "",
  id: btoa(`Teacher-${0}`),
  isSaved: false,
  lastName: "",
  legacyId: 0,
  numRatings: 33,
  school: {
    id: "",
    name: "",
  },
  wouldTakeAgainPercent: -1,
};

const courseTable = document.querySelector("#table1");

const tableObserver = new MutationObserver(() => {
  chrome.storage.local.get("enabled", function (data) {
    if (data.enabled) {
      displayProfessorRatings();
    }
  });
});

tableObserver.observe(courseTable, { subtree: true, childList: true });

// Payload
/*
{
  "query": "query TeacherSearchResultsPageQuery(\n  $query: TeacherSearchQuery!\n  $schoolID: ID\n) {\n  search: newSearch {\n    ...TeacherSearchPagination_search_1ZLmLD\n  }\n  school: node(id: $schoolID) {\n    __typename\n    ... on School {\n      name\n    }\n    id\n  }\n}\n\nfragment TeacherSearchPagination_search_1ZLmLD on newSearch {\n  teachers(query: $query, first: 8, after: \"\") {\n    didFallback\n    edges {\n      cursor\n      node {\n        ...TeacherCard_teacher\n        id\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    resultCount\n    filters {\n      field\n      options {\n        value\n        id\n      }\n    }\n  }\n}\n\nfragment TeacherCard_teacher on Teacher {\n  id\n  legacyId\n  avgRating\n  numRatings\n  ...CardFeedback_teacher\n  ...CardSchool_teacher\n  ...CardName_teacher\n  ...TeacherBookmark_teacher\n}\n\nfragment CardFeedback_teacher on Teacher {\n  wouldTakeAgainPercent\n  avgDifficulty\n}\n\nfragment CardSchool_teacher on Teacher {\n  department\n  school {\n    name\n    id\n  }\n}\n\nfragment CardName_teacher on Teacher {\n  firstName\n  lastName\n}\n\nfragment TeacherBookmark_teacher on Teacher {\n  id\n  isSaved\n}\n",
  "variables": {
    "query": {
      "text": "bob",
      "schoolID": "U2Nob29sLTEzMDY=",
      "fallback": true,
      "departmentID": null
    },
    "schoolID": "U2Nob29sLTEzMDY="
  }
}
/*


// Response
/* {
    "data": {
        "school": {
            "__typename": "School",
            "id": "U2Nob29sLTEzMDY=",
            "name": "University of Texas Rio Grande Valley (all campuses)"
        },
        "search": {
            "teachers": {
                "didFallback": false,
                "edges": [
                    {
                        "cursor": "YXJyYXljb25uZWN0aW9uOjA=",
                        "node": {
                            "__typename": "Teacher",
                            "avgDifficulty": 1.1,
                            "avgRating": 4.7,
                            "department": "Anthropology",
                            "firstName": "Bobbie",
                            "id": "VGVhY2hlci00MjYwMDE=",
                            "isSaved": false,
                            "lastName": "Lovett",
                            "legacyId": 426001,
                            "numRatings": 33,
                            "school": {
                                "id": "U2Nob29sLTEzMDY=",
                                "name": "University of Texas Rio Grande Valley (all campuses)"
                            },
                            "wouldTakeAgainPercent": -1
                        }
                    },
                    {
                        "cursor": "YXJyYXljb25uZWN0aW9uOjE=",
                        "node": {
                            "__typename": "Teacher",
                            "avgDifficulty": 0,
                            "avgRating": 0,
                            "department": "Education",
                            "firstName": "Bobbette",
                            "id": "VGVhY2hlci0yNjA2ODYz",
                            "isSaved": false,
                            "lastName": "Morgan",
                            "legacyId": 2606863,
                            "numRatings": 0,
                            "school": {
                                "id": "U2Nob29sLTEzMDY=",
                                "name": "University of Texas Rio Grande Valley (all campuses)"
                            },
                            "wouldTakeAgainPercent": -1
                        }
                    }
                ],
                "filters": [
                    {
                        "field": "teacherdepartment_s",
                        "options": [
                            {
                                "id": "RGVwYXJ0bWVudC0z",
                                "value": "anthropology"
                            },
                            {
                                "id": "RGVwYXJ0bWVudC0xNg==",
                                "value": "education"
                            }
                        ]
                    }
                ],
                "pageInfo": {
                    "endCursor": "YXJyYXljb25uZWN0aW9uOjE=",
                    "hasNextPage": false
                },
                "resultCount": 2
            }
        }
    }
} */
