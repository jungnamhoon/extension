import {RESULT_CATEGORY} from './variables.js';
import {baseUrl} from './variables.js';
import {markUploadFailedCSS,markUploadedCSS} from './util.js';

export async function submitProblem(bojData,accessToken) {

  const requestBody = {
    submitId: bojData.submissionId,
    baekjoonId: bojData.problemId,
    isSolved: bojData.resultCategory === RESULT_CATEGORY.RESULT_ACCEPTED,
    code: bojData.code,
    resultCategory: bojData.resultCategory,
    problemDescription: bojData.problem_description,
    problemInput: bojData.problem_input,
    problemOutput: bojData.problem_output
  };

  console.log("업로드 요청", requestBody);

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