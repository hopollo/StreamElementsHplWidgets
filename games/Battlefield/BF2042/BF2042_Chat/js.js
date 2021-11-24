const debug = true;
const coupleMessages = true;
let lastMsg;
let channelName = "";

window.addEventListener('onEventReceived', (obj) => {
  	const o = obj.detail;
  	if (debug) console.log(o);
  
  	switch(o.listener) {
      case "message": 
        	createMessage(o);	
        break;
      case "delete-messages":
        	deleteMessage(o);
        break;
    }
});

window.addEventListener('onWidgetLoad', async (obj) => {
  channelName = obj.detail.channel.username;
  // first init
  await getCurrentGame();
  
  // starting timer after
  setInterval(getCurrentGame, 60 * 1000);
});

async function getCurrentGame() {
  try {
    const fetchedGame = await fetch(`https://decapi.me/twitch/game/${channelName}`).then(res => res.text());
	if (debug) console.log('recents', fetchedGame);
    
    (fetchedGame === 'Battlefield 2042') ? $('.main-container').css('display', 'block') : $('.main-container').css('display', 'none');
  } catch (error) { console.error(error); }
}

function deleteMessage(e) {
  $(`.${e.event.userId}`).empty();
}

async function createMessage(e) {
  if (debug) console.log(e);
  const evt = e.event.data;

  const banned = ['streamelements', 'djungbot', 'wizebot'];
  const alt = evt.nick;

  if (banned.includes(evt.nick)) return;

  const userId = evt.userId;
  const color = evt.displayColor;
  const name = evt.displayName;
  const msgId = evt.msgId;
  
  if (userId == '26069167') extra = 'creator';
  
  const text = e.event.renderedText;

  if (name == lastMsg && $('.main-container li:last-child').length !== 0) {
    const supp = `
      <li class="message">${text}</li>
    `;

    $('li:last-child .messageUl').append(supp);
  } else {
    const item = `
    <li class="bubble ${extra} ${userId}">
        <div class="name">${name + ': '}</div>
        <ul class="messageUl">
            <li class="message">${text}</li>
        </ul>
	  </div>
    </li>`;
    $('.messages').append(item);
  }

  lastMsg = name;
  
  checkVisibility();
}

function checkVisibility() {
  $('.messages').each(function(){
    $(this).find('li.bubble').each(function(){
		const self = $(this);
        if(self.offset().top < 60) {
          self.addClass('purge');

          setTimeout(() => {
            self.detach();
          }, 1000);
        }
    });
  });
}
