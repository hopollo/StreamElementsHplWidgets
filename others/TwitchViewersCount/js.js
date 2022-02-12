let channelName = null;
window.addEventListener('onWidgetLoad', async (obj) => {
  	channelName = obj.detail.channel.username;
  	
  	fetchViewers();
  
  	setInterval(() => fetchViewers(), 60000);
});

async function fetchViewers() {
  const res = await fetch(`https://decapi.me/twitch/viewercount/${channelName}`);
  const data = await res.text();
  
  let viewersCount = "Offline";
  
  !data.includes('offline') && Math.round(data) >= 1000 ? `${data.substring(0, 3)}K viewers` : `${data} viewers`;
  	
  $('.main-container span').text(viewersCount);
}
