const baseUrl = "https://api.skyisthelimit.cloud"

$('#enabled-switch').on('click', () => {
  const isChecked = $('#enabled-switch').is(':checked');
  chrome.storage.local.set({ 'bjhEnable': isChecked }, () => {
    console.log('bjhEnable has been set to:', isChecked);
  });
});

chrome.storage.local.get('bjhEnable', (data4) => {
  const value = data4.bjhEnable;
  if (value === undefined) {
    $('#enabled-switch').prop('checked', true);
    chrome.storage.local.set({ 'bjhEnable': $('#enabled-switch').is(':checked') }, () => {
      console.log('bjhEnable has been set to true');
    });
  } else {
    $('#enabled-switch').prop('checked', value);
    chrome.storage.local.set({ 'bjhEnable': $('#enabled-switch').is(':checked') }, () => {
      console.log('bjhEnable has been set to:', value);
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get('accessToken');
  const token = data.accessToken;

  const authMode = document.getElementById('auth_mode');
  const settingsContainer = document.getElementById('settings-container');

  if (token) {
    authMode.style.display = 'none';
    settingsContainer.style.display = 'block';
  } else {
    authMode.style.display = 'block';
    settingsContainer.style.display = 'none';
  }

});

document.getElementById('authenticate').addEventListener('click', function() {
    const oauthUrl = `${baseUrl}/oauth2/authorization/google?redirect=extension`;

    chrome.identity.launchWebAuthFlow({
      url: oauthUrl,
      interactive: true
    }, async function(redirectUrl) {
      const accessToken = await getAccessTokenFromServer();
      updateUIBasedOnAuth(accessToken);
    });
  });


async function getAccessTokenFromServer() {
  try {
    const response = await fetch(`${baseUrl}/auth/reissue/access`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();
    const accessToken = data.data.accessToken;

    await chrome.storage.local.set({ 'accessToken': accessToken });

    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

function updateUIBasedOnAuth(accessToken) {

  const authMode = document.getElementById('auth_mode');
  const settingsContainer = document.getElementById('settings-container');

  if (accessToken) {
    window.close();
    authMode.hidden = true;
    settingsContainer.style.display = 'block';

  } else {
    authMode.hidden = false;
    settingsContainer.style.display = 'none';
  }
}