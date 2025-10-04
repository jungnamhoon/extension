import {isNull,isEmpty} from './util.js';

export function findUsername() {
  const el = document.querySelector('a.username');
  if (isNull(el)) return null;
  const username = el?.innerText?.trim();
  if (isEmpty(username)) return null;
  return username;
}

export function isExistResultTable() {
  return document.getElementById('status-table') !== null;
}

export function findFromResultTable() {
  if(!isExistResultTable()) {
    console.log('Result Table Not Found');
  }
  return parsingResultTableList(document);
}

function parsingResultTableList(document) {

  const table = document.querySelector("#status-table");

  if (!table) {
    console.log("#status-table not found!");
    return [];
  }

  const topSubmissionRow = document.querySelector("#status-table > tbody > tr");

  const submissionColumns = topSubmissionRow.querySelectorAll('td');
  
  const submissionId = parseInt(submissionColumns[0].innerText || submissionColumns[0].textContent, 10);
  const problemId = parseInt(submissionColumns[2].innerText || submissionColumns[2].textContent, 10);

  const resultText =(submissionColumns[3].innerText || submissionColumns[3].textContent).trim();
  console.log("Result Text:", resultText);

  let isCorrect = null;

  if (resultText === "맞았습니다!!") {
    isCorrect = true;
  } else if (resultText === "틀렸습니다!!" || resultText === "시간 초과" || resultText === "메모리 초과" || resultText === "출력 초과" || resultText === "런타임 에러") {
    isCorrect = false;
  } else {
    console.log("Unrecognized result text:", resultText);
    return null;
  }
  
  const result = {
    submissionId,
    problemId,
    isCorrect
  };
  console.log("Parsed Result:", result);

  return result;
}