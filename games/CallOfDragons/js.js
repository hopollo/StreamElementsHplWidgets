const recrutement = ['fossabot','streamelements'];

window.addEventListener('onEventReceived', async (obj) => {
    if (!obj.detail.event) return;
  
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
  
  	switch (listener) {
      case 'tip':
      case 'follower':
      case 'host':
      case 'raid':
      case 'subscriber':
      case 'cheers':
        const eventMsg = `<li class="commerce"><span class="author">${event.name}</span> : Nv. ${listener} (x${!event.amount ? "1" : event.amount})</li>`;
        $('.chat').append(eventMsg);
        checkVisibility();
      	break;
    }
  
  	if (listener !== "message") return;
  
  	let author = event.data.displayName;
	const message = event.renderedText;
  
  	const res = await fetch(`https://decapi.me/twitch/followage/${event.data.channel}/${author}`)
    const data = await res.text();
    let className = await data.match(/[0-9]/g) ? "groupe" : "normal";
  
	let type = "";
  
    event.data.badges.forEach(async b => {
      switch (b.type) {
        case 'vip': className = "groupe"; break;
        case 'subscriber':
        case 'founder': className = "guilde"; break;
        case 'moderator': className = "mod"; break;
        case 'broadcaster': className = "broadcaster"; break;
      }
    });
  
    if (recrutement.includes(author.toLowerCase())) className = "recrutement";

  // populate channel name to assing the type as well for css colors
    switch(className) {
      case "broadcaster": type = "[ADM]"; break;
      case "mod": type = "[MOD]"; break;
      case "guilde": type = "[SUB]"; break;
      case "groupe": type = "[FOL]"; break;
      case "recrutement": type = "[BOT]"; break;
      case "commerce": type = ""; break;
    }
  
    const msg = `<li><span style="font-weight: bold;">${type}</span><span class="author">${author}</span>: ${message}</li>`;

    $('.chat').append(msg);
   	checkVisibility();
});

function checkVisibility() {
  const container = $(".chat");
  const scrollTarget = $(".chat li:last");

  container.animate({
    scrollTop: scrollTarget.offset().top - container.offset().top +
    container.scrollTop()
  }, {
    complete: function() {
      if (container.children().first().offset().top < container.scrollTop()) {
        // Remove the first child if it's out of view
        container.children().first().remove();
      }
    }
  });
}
