/**
 * 업로드 진행 표시용 UI를 초기화하고 DOM에 추가하는 함수
 * @description id가 'BaekjoonHub_progress_anchor_element'인 요소를 찾고,없으면 생성 후
 *              내부에 progress 표시용 div를 추가하여 적절한 위치에 삽입
 * @returns {void}
 */
export function initUploadProgressUI() {

  // 1️⃣ id가 'BaekjoonHub_progress_anchor_element'인 요소가 있는지 확인
  let elem = document.getElementById('BaekjoonHub_progress_anchor_element');

  // 2️⃣ 요소가 없으면 새 span 요소 생성 및 초기화
  if (elem !== undefined) {
    elem = document.createElement('span');
    elem.id = 'BaekjoonHub_progress_anchor_element';
    elem.className = 'runcode-wrapper__8rXm';
    elem.style = 'margin-left: 10px;padding-top: 0px;';
  }
  
  // 3️⃣ 생성한 요소 내부에 진행 상태 표시용 div 추가
  elem.innerHTML = `<div id="BaekjoonHub_progress_elem" class="BaekjoonHub_progress"></div>`;
  const target = document.getElementById('status-table')?.childNodes[1].childNodes[0].childNodes[3] 
  || document.querySelector('div.table-responsive > table > tbody > tr > td:nth-child(5)');
  target.append(elem);
  if (target.childNodes.length > 0) {
    target.childNodes[0].append(elem);
  }
}

/**
 * 업로드 성공 상태를 UI에 표시하는 함수
 * @description progress 요소의 클래스를 'markuploaded'로 변경하여 업로드가 완료되었음을 화면에 표시
 * @returns {void}
 */
export function showUploadSuccessUI() {
    const elem = document.getElementById('BaekjoonHub_progress_elem');
    if (elem) {
        elem.className = 'markuploaded';
    }
}

/**
 * 업로드 실패 상태를 UI에 표시하는 함수
 * @description progress 요소의 클래스를 'markuploadfailed'로 변경하여 업로드가 실패했음을 화면에 표시
 * @returns {void}
 */
export function showUploadFailureUI() {
    const elem = document.getElementById('BaekjoonHub_progress_elem');
    if (elem) {
        elem.className = 'markuploadfailed';
    }
}