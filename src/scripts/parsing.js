import {isNull,isEmpty,filter} from './util.js';
import {RESULT_CATEGORY} from './variables.js';

/**
 * 로그인된 사용자의 username을 찾습니다.
 * @returns {string|null} - username이 존재하면 문자열, 없으면 null 반환
 */
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

export async function findData(data) {
  try {
    if(isNull(data)) {
      let table = findFromResultTable();
      if(isEmpty(table)) return null;

      const validCategories = Object.values(RESULT_CATEGORY);
      table = table.filter(item => validCategories.includes(item.resultCategory));
      data = table[0];
      if(isNaN(Number(data.problemId)) || Number(data.problemId) < 1000)  throw new Error(`정책상 대회 문제는 업로드 되지 않습니다. 대회 문제가 아니라고 판단된다면 이슈로 남겨주시길 바랍니다.\n문제 ID: ${data.problemId}`);
      data = {...data,...await getProblemDescriptionById(data.problemId)};
      data = {...data,...{code: await getSubmitCodeById(data.submissionId)}};
      return data;
    }
  } catch (error) {
      console.error(error);
  }
  return null;
}

/**
 * 결과 테이블을 파싱하여 제출 정보 리스트를 반환합니다.
 * @param {Document} doc
 * @returns {Array<{
 *   elementId: string,        // tr 요소 id (ex: "solution-101265276")
 *   submissionId: string,     // 제출 번호
 *   problemId: string,        // 문제 번호
 *   username: string,         // 제출자 아이디
 *   result: string,           // 채점 결과 텍스트 (ex: "맞았습니다!!")
 *   resultCategory: string,   // 결과 카테고리 (ac, wa 등)
 *   language: string,         // 사용 언어 (ex: "C++17")
 *   runtime: string,          // 실행 시간
 *   memory: string,           // 사용 메모리
 *   codeLength: string,       // 코드 길이
 *   submissionTime: string   // 제출 시간 (ex: "2025년 12월 22일 18:14:31")
 * }>}
 */
function parsingResultTableList(doc) {
  const table = doc.getElementById('status-table');
  if (table === null || table === undefined || table.length ===0) return [];
  const headers = Array.from(table.rows[0].cells,(x) =>convertResultTableHeader(x.innerText.trim()));

  const list = [];
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = Array.from(row.cells,(x,index) => {
      const header = headers[index];
      
      switch(header){
        case 'problemId':
          const a = x.querySelector('a.problem_title');
          if(isNull(a)) return null;
          return {problemId: a.getAttribute('href').replace(/^.*\/([0-9]+)$/, '$1')};
        case 'result':
          return {result: x.innerText.trim(), resultCategory: x.firstChild.getAttribute('data-color').replace('-eng','')};
        case 'language':
          return x.innerText.trim().replace(/\/.*$/g, '');
        case 'submissionTime':
          const el = x.querySelector('a.show-date');
          if(isNull(el)) return null;
          return el.getAttribute('data-original-title');
        default:
          return x.innerText.trim();

      }
    });

    let obj = {};
    obj.elementId = row.id;
    for(let j = 0; j < headers.length; j++){
      obj[headers[j]] = cells[j];
    }

    obj = { ...obj, ...obj.result, ...obj.problemId };
    list.push(obj);
  }

  return list;
}

function convertResultTableHeader(header) {
  switch(header) {
    case '제출 번호':
      return 'submissionId';
    case '아이디':
      return 'username';
    case '문제':
      return 'problemId';
    case '결과':
      return 'result';
    case '메모리':
      return 'memory';
    case '시간':
      return 'runtime';
    case '언어':
      return 'language';
    case '코드 길이':
      return 'codeLength';
    case '제출한 시간':
      return 'submissionTime';
    default:
      return 'unknown';
  }
}


async function getProblemDescriptionById(problemId){
  let problem = await fetchProblemDescriptionById(problemId);
  return problem;
}

async function fetchProblemDescriptionById(problemId) {
  return fetch(`https://www.acmicpc.net/problem/${problemId}`)
    .then((res) => res.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return parseProblemDescription(doc);
    });
}

async function getSubmitCodeById(submissionId) {
  let code = await fetchSubmitCodeById(submissionId);
  return code;
}

async function fetchSubmitCodeById(submissionId) {
  return fetch(`https://www.acmicpc.net/source/download/${submissionId}`, { method: 'GET' })
    .then((res) => res.text())
}

function parseProblemDescription(doc = document) {
  convertImageTagAbsoluteURL(doc.getElementById('problem_description')); //이미지에 상대 경로가 있을 수 있으므로 이미지 경로를 절대 경로로 전환 합니다.

  const problemId = doc.getElementsByTagName('title')[0].textContent.split(':')[0].replace(/[^0-9]/, '');
  const problem_description = unescapeHtml(doc.getElementById('problem_description').innerHTML.trim());
  const problem_input = doc.getElementById('problem_input')?.innerHTML.trim?.().unescapeHtml?.() || 'Empty'; // eslint-disable-line
  const problem_output = doc.getElementById('problem_output')?.innerHTML.trim?.().unescapeHtml?.() || 'Empty'; // eslint-disable-line
  if (problemId && problem_description) {
    // console.log(`문제번호 ${problemId}의 내용을 저장합니다.`);
    // updateProblemsFromStats({ problemId, problem_description, problem_input, problem_output});
    return { problemId, problem_description, problem_input, problem_output};
  }
  return {};
}

function convertImageTagAbsoluteURL(doc = document) {
  if(isNull(doc)) return;
  // img tag replace Relative URL to Absolute URL.
  Array.from(doc.getElementsByTagName('img'), (x) => {
    x.setAttribute('src', x.currentSrc);
    return x;
  });
}

/**
 * escape된 문자열을 unescape하여 반환합니다.
 * @param {string} text - unescape할 문자열
 * @returns {string} - unescape된 문자열
 */
function unescapeHtml(text) {
  const unescaped = {
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
    '&nbsp;': ' ',
    '&#160;': ' ',
  };
  return text.replace(/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g, function (m) {
    return unescaped[m];
  });
}

/** 문자열을 unescape 하여 반환합니다. */
String.prototype.unescapeHtml = function () {
  return unescapeHtml(this);
};
