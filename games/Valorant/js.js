let text, channelName, interval;
let debug = false;

window.addEventListener('onWidgetLoad', async (obj) => {
   channelName = obj.detail.channel.username;
  
   interval = setInterval(() => checkCurrentGame(), 60000);
  
   checkCurrentGame();
});

async function checkCurrentGame() {
  const isOnline = await fetch(`https://decapi.me/twitch/status/${channelName}`);
  const isOnlineData = await isOnline.text();
  
  if (isOnlineData.toLowerCase().includes('offline') || !debug) return console.warn('Channel Offline');
  
  const res = await fetch(`https://decapi.me/twitch/game/${channelName}`);
  const data = await res.text();
  data.toLowerCase().includes('valorant') ? $('.main-container').css('display', 'block') : $('.main-container').css('display', 'none');
  
  checkValorantRank();
}

async function checkValorantRank() {
  const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/eu/{{name}}/{{tag}}`);
  const { data } = await res.json();
  
  debug && console.log(data);
  
  if (!data) return false;
  
  $('#elo').text(data.elo !== null ? data.elo : "...");
  $('#ranking_in_tier').text(data.ranking_in_tier !== null ? data.ranking_in_tier : "");
  $('#statsIMG').attr('src', data.images.large);
}
