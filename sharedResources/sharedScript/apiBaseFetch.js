
const apiUrl = 'https://api.noroff.dev/api/v1';


async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network is whack');
        //will adjust my attitude later XD
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('There was a problem fetching this API!', error);
    }
  }
  
  fetchData();