// CREATED BY @HOPOLLOTV

let channelName = "";

window.addEventListener('onEventReceived', (obj) => {
    if (!obj.detail.event) return;
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    if (listener === 'follower') generateFollowAlert(event.name);
});

window.addEventListener('onWidgetLoad', (obj) => {  
  channelName = obj.detail.channel.username;
  const recents = obj.detail.session.data['follower-recent'];
  
  recents.slice(0, {{eventsLimit}}-1).map(f => generateFollowAlert(f.name));
});

function generateFollowAlert(name) {
  const data = $(`
	<div class="feed__item fadeInClass">
		<span class="follower">${name}</span>
		<img class="icon" src="https://cdn.discordapp.com/attachments/741110124831178934/830484633689784330/New_Project.png">
		<span class="broadcaster">${channelName}</span>
	</div>`).hide().fadeIn({{fadeDuration}}).delay({{fadeoutTime}} * 1000).fadeOut({{fadeDuration}} * 1000, function() { $(this).remove(); });
  
  if ("{{direction}}" === "desc") {
    $('.main-container').prepend(data);
  } else {
    $('.main-container').append(data);
  }
  
  CheckRemoveEvent();
}

function CheckRemoveEvent() {
  if ($('.main-container div').length >= {{eventsLimit}}) {
    if ("{{direction}}" === "desc") {
      $('.main-container div').last().fadeOut(400, () => {
        $('.main-container div').last().remove();
      });
    } else {
      $('.main-container div').first().fadeOut(400, () => {
        $('.main-container div').first().remove();
      });
    }
  }
}
