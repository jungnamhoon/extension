import {findUsername, isExistResultTable,findFromResultTable} from './parsing.js';
import {isEmpty, isNull, startUpload,markUploadedCSS,markUploadFailedCSS} from './util.js';
import {checkEnable} from './enable.js';
import {baseUrl} from './variables.js';

let loader;

const currentUrl = window.location.href;

const username = findUsername();

if (!isNull(username)) {
    if (['status', `user_id=${username}`, 'problem_id', 'from_mine=1'].every((key) => currentUrl.includes(key))) startLoader();
}


function startLoader() {
    loader = setInterval(async () =>{
        const enable = await checkEnable();
        if(!enable) {
            stopLoader();
        }
        else if (isExistResultTable()) {
            const row = findFromResultTable();
            if (isEmpty(row)) return;
            if(!row) return;
            stopLoader();
            console.log("SkyIsTheLimit에 업로드를 시작합니다.");
            startUpload();

            const data = await chrome.storage.local.get('accessToken');
            const accessToken = data.accessToken;
            
            if (isNull(accessToken)) {
                console.log("AccessToken이 없습니다. 업로드를 중단합니다.");
                markUploadFailedCSS();
                return;
            }

            setTimeout(() => {
                submitProblem(
                    row.submissionId,
                    row.problemId,
                    row.isCorrect,
                    accessToken
            );
        }, 2000);
        }
    },2000);
}

function stopLoader() {
    clearInterval(loader);
    loader = null;
}

async function submitProblem(submissionId, problemId, isCorrect, accessToken) {
  const requestBody = {
    submitId: submissionId,
    baekjoonId: problemId,
    isSolved: isCorrect
  };

  try {
    const res = await fetch(`${baseUrl}/api/members/me/problems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }

    const data = await res.json();
    markUploadedCSS(); // 성공 UI 처리
    console.log("업로드 성공:", data);

  } catch (error) {
    markUploadFailedCSS(); // 실패 UI 처리
    console.error("업로드 실패:", error);
  }
}
