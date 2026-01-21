/**
 * chrome.storage.local 에서 특정 key에 해당하는 값을 가져오는 함수
 * @param {string} key - 가져올 로컬 스토리지 키
 * @returns {Promise<any>} - 해당 key에 저장된 값 (없으면 undefined)
 */
export async function getObjectFromLocalStorage(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function(value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}