let channelName = null;
window.addEventListener('onWidgetLoad', async (obj) => {
  	channelName = obj.detail.channel.username;
  	
  	fetchViewers();
  
  	setInterval(() => fetchViewers(), 60000);
});

function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}

async function fetchViewers() {
  const res = await fetch(`https://decapi.me/twitch/viewercount/${channelName}`);
  const data = await res.text();
  
  let viewersCount = null;
  
  if (data.includes('offline')) {
    viewersCount = 'Offline';
  } else {
  	viewersCount = `${kFormatter(data)} viewers`;
  }
  
  $('.main-container span').text(viewersCount);
}


