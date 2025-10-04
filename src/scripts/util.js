import { uploadState } from './variables.js';

export function isNull(value) {
  return value === null || value === undefined;
}

export function isEmpty(value) {
  return isNull(value) || (value.hasOwnProperty('length') && value.length === 0);
}

export function startUpload() {
  let elem = document.getElementById('BaekjoonHub_progress_anchor_element');
  if (elem !== undefined) {
    elem = document.createElement('span');
    elem.id = 'BaekjoonHub_progress_anchor_element';
    elem.className = 'runcode-wrapper__8rXm';
    elem.style = 'margin-left: 10px;padding-top: 0px;';
  }
  
  elem.innerHTML = `<div id="BaekjoonHub_progress_elem" class="BaekjoonHub_progress"></div>`;
  const target = document.getElementById('status-table')?.childNodes[1].childNodes[0].childNodes[3] || document.querySelector('div.table-responsive > table > tbody > tr > td:nth-child(5)');
  target.append(elem);
  if (target.childNodes.length > 0) {
    target.childNodes[0].append(elem);
  }
  startUploadCountDown();
}

function startUploadCountDown() {

  uploadState.uploading = true;
  uploadState.countdown = setTimeout(() => {
    if (uploadState.uploading === true) {
      console.log("업로드에 실패했습니다.");
      markUploadFailedCSS();
    }
  }, 20000);
}


export function markUploadedCSS () {
  uploadState.uploading = false;
  const elem = document.getElementById('BaekjoonHub_progress_elem');
  elem.className = 'markuploaded';
}

export function markUploadFailedCSS() {
  uploadState.uploading = false;
  const elem = document.getElementById('BaekjoonHub_progress_elem');
  elem.className = 'markuploadfailed';
}
