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
