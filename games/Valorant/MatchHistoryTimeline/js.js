let text, channelName, interval;
let debug = true;
const matchesHistory = [];

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
  data.toLowerCase().includes('valorant') ? $('.main-container').css('display', 'flex') : $('.main-container').css('display', 'none');
  
  debug && $('.main-container').css('display', 'flex');
  
  checkValorantGames();
}

async function checkValorantGames() {
  debug && console.log("fetching stats...");
  const res = await fetch(`https://api.henrikdev.xyz/valorant/v3/matches/eu/{{name}}/{{tag}}?filter={{matchFilter}}`);
  const data = await res.json();
  
  if (data.status === 200) {
    filterMatches(data.data);
  } else {
    console.warn("API Error :", data.errors[0].message);
  }
}

function filterMatches(matches) {
  matches.map((match) => {
    const isExisting = matchesHistory.includes(match.metadata.matchid);
    
    if (!isExisting) {
      matchesHistory.push(match.metadata.matchid);
  	
      addNewMatch(match);
    } else {
      debug && console.log('matchid existing, skipping');
      return false;
    }
  });
}

async function addNewMatch(match) {
  	debug && console.log('creating match element', match);
  	const matchMap = match.metadata.map.toLowerCase();
    //const matchMapImage = `https://blitz-cdn.blitz.gg/blitz/val/maps/${matchMap}/${matchMap}-hero-new.jpeg`;
    const matchID = match.metadata.matchid;
    const isRedTeamWinning = match.teams.red.has_won;
    const currentPlayer = match.players.all_players.filter((players) => players.name.toLowerCase() == "{{name}}")[0];
   	
    //const agentUsed = currentPlayer.character.toLowerCase();
    //const agentUsedImage = `https://blitz-cdn.blitz.gg/blitz/val/agents/${agentUsed}/${agentUsed}-cutout-compressed.webp`;
   	const currentPlayerTeam = currentPlayer.team == "Red";
  
  	const isWin = currentPlayerTeam === isRedTeamWinning;
   /// REVOIR COMPARAISON ENTRE WINNING TEAM ET CELLE DU JOUEUR CONCERNE
  	const agentUsed = currentPlayer.assets.agent.small;
  
  	//const mapUsed = await fetch(`https://api.henrikdev.xyz/valorant/v2/match/${matchID}`);
    //<img class="map__background" src="${matchMapImage}"> -->
    const matchElement = `<div id="${matchID}" class="matchContainer ${isWin ? "win" : "loss"}"><img src="${agentUsed}"></div>`;
  
  	$('.main-container').prepend(matchElement);
}
