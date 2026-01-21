import { getObjectFromLocalStorage } from './storage.js'; 
/**
 * 확장이 활성화되어 있는지 확인하는 함수
 * @async
 * @returns {Promise<boolean|undefined>} - 확장이 활성화 상태면 true, 비활성화 상태면 undefined
 */
export async function checkEnable() {
    const enable = await getObjectFromLocalStorage('bjhEnable');
    if(!enable) {
      console.log('비활성화 상태입니다. 확장을 활성화하고 시도해주세요');
    }
    return enable;
}