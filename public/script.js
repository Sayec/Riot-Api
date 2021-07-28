// require('dotenv').config();

const button = document.querySelector('button.submit');
let data_items;
let data_champions;
fetch('http://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/item.json')
  .then((response) => response.json())
  .then((data) => {
    data_items = data;
  });

fetch('http://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/champion.json')
  .then((response) => response.json())
  .then((data) => {
    data_champions = data;
  });
console.log(window.location);

button.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    console.log('available');
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const data = { lat, lon };
      console.log(data);
      const options = {
        method: 'POST',
        url: '/api',
        data: data,
      };

      axios(options).then((response) => {
        console.log(response.data);
      });
    });
  } else {
    console.log('not available');
  }
});

const input = document.querySelector('input');
const btn = document.querySelector('a.search');
const rankText = document.querySelector('p');
const statsContainer = document.querySelector('div.stats-container');
const server_select = document.getElementById('server_select');

let url = new URL(location);
let params = new URLSearchParams(url.search.slice(1));
let paramName = url.searchParams.get('name');
let paramServerName = url.searchParams.get('server');

let playerData = {};
let playerRank = {};
let idMatch = 0;
server_select.addEventListener('change', () => {});
btn.addEventListener('click', async () => {
  const name = input.value;
  const server = server_select.value;
  location.href = `./?name=${name}&server=${server}`;
});
document.addEventListener('DOMContentLoaded', async () => {
  const name = paramName;
  const server = paramServerName;
  let array = Array.from(server_select.options);
  server_select.options[
    array.map((element) => element.value).indexOf(server)
  ].selected = true;
  document.title = name || 'Check player rank';
  let matchesArray = [];
  if (name) {
    playerData = await getSummonerName(name, server);
    console.log(playerData);
    playerRank = await getUserRank(playerData, server);
    console.log(playerRank);
    rankText.innerHTML = playerRank
      ? `${playerRank.tier} ${playerRank.rank} ${playerRank.leaguePoints}`
      : 'brak danych o randze gracza na Solo 5v5';
    playerMatches = await getPlayerMatches(playerData);
    matchPromises = getNumberofMatches(playerMatches, 10);
    Promise.all(matchPromises).then((res) => {
      matchesArray = res;
      printStats(matchesArray);
    });
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    };
    const response = await fetch('/api', options);
    const data = await response.json();
    console.log(data);
  }
});

const getSummonerName = async (name, server) => {
  const response = await fetch(`/summonerName/${name}/${server}`);
  const data = await response.json();
  return data;
};

const getUserRank = async ({ id }, server) => {
  const response = await fetch(`/summonerRank/${id}/${server}`);
  const data = await response.json();
  const rank = data.filter((element) => {
    return element.queueType === 'RANKED_SOLO_5x5';
  });
  return rank[0];
};

const getPlayerMatches = async ({ puuid }) => {
  const response = await fetch(`/playerMatch/${puuid}`);
  const data = await response.json();
  return data;
};
// const getMatchParti = async (matchId) => {
//   const response = await fetch(
//     `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${riot_api}`
//   );
//   const data = await response.json();
//   return data;
// };
const getMatchParti = async (matchId) => {
  const response = await fetch(`/matchParti/${matchId}`);
  const data = await response.json();
  return data;
};
const getNumberofMatches = (data, getNumberofMatches) => {
  let promises = [];
  for (let i = 0; i < getNumberofMatches; i++) {
    promises.push(getMatchParti(data[i]));
  }
  return promises;
};

const printStats = (arrayOfMatches) => {
  console.log(arrayOfMatches[0]);
  arrayOfMatches.forEach((data) => {
    const idIndex = data.metadata.participants.indexOf(playerData.puuid);
    const {
      kills,
      deaths,
      assists,
      championName,
      teamId,
      item0,
      item1,
      item2,
      item3,
      item4,
      item5,
      item6,
    } = data.info.participants[idIndex];
    const teamIndex = data.info.teams
      .map((team) => team.teamId)
      .indexOf(teamId);
    const itemArray = [item0, item1, item2, item3, item4, item5, item6];
    const divElement = document.createElement('div');
    divElement.classList.add('stats-element');
    divElement.classList.add(
      `${data.info.teams[teamIndex].win ? 'win' : 'lose'}`
    );
    const championImg = document.createElement('img');
    championImg.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/${championName}.png`;
    championImg.classList.add('champion_img');
    const pChampion = document.createElement('p');
    pChampion.classList.add('champion-name');
    pChampion.innerHTML += `${championName} ${kills}/${deaths}/${assists}`;
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('itemDiv');
    for (let i = 0; i < 7; i++) {
      const imgItem = document.createElement('img');
      imgItem.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/item/${itemArray[i]}.png`;
      imgItem.classList.add('item');
      itemDiv.appendChild(imgItem);
    }
    divElement.appendChild(pChampion);
    divElement.appendChild(itemDiv);
    divElement.appendChild(championImg);

    statsContainer.appendChild(divElement);
  });
};

const endFunction = () => {
  console.log('end');
};
