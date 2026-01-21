import {findUsername, isExistResultTable,findFromResultTable,findData} from './parsing.js';
import {isEmpty, isNull, startUpload,markUploadedCSS,markUploadFailedCSS} from './util.js';
import {checkEnable} from './enable.js';
import {baseUrl,RESULT_CATEGORY} from './variables.js';
import {submitProblem} from './upload.js';
import {getObjectFromLocalStorage} from './storage.js';
import { initUploadProgressUI } from './ui.js';

let loader;
const currentUrl = window.location.href;
const username = findUsername();
if (!isNull(username)) {
    if (['status', `user_id=${username}`, 'problem_id', 'from_mine=1'].every((key) => currentUrl.includes(key))) startLoader();
}

function startLoader() {
    loader = setInterval(async () => {

      // 1. 업로드 활성화 여부 확인 -> 비활성화 상태이면 로더 중지
      const enable = await checkEnable();
      if (!enable) stopLoader();

      // 2. 결과 테이블 존재 여부 확인 -> 아직 결과 테이블이 없기 때문에 다음 루프 대기
      if (!isExistResultTable()) return;

      // 3. 결과 테이블 가져와서 첫 번째 행 추출
      const resultTable = findFromResultTable();
      const latestResult = resultTable[0];

      // 4. 첫번째 결과 행에 username, resultCategory 속성 존재 여부 확인
      if (!latestResult.hasOwnProperty('username') || !latestResult.hasOwnProperty('resultCategory')) return;
      const {username: resultUsername, resultCategory} = latestResult;

      // 5. 채점이 완료되지 않은 경우 다음 루프 대기 
      if(!Object.values(RESULT_CATEGORY).includes(resultCategory)) return;

      // 6. 모든 조건을 통과하면 루프를 멈추고 업로드 시작
      stopLoader();

      // 7. 업로드를 UI에 표시
      initUploadProgressUI();

      // 8. 스토리지에서 액세스 토큰 가져오기
      const accessToken = await getObjectFromLocalStorage('accessToken');

      const bojData = await findData();
      submitProblem(bojData, accessToken);
    }, 2000);
}

function stopLoader() {
    clearInterval(loader);
    loader = null;
}