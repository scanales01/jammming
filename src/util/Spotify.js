const clientID = '';
const redirectURI = '';
const scope = 'playlist-modify-public'

// let state = generateRandomString(16);

let authorizeURL = 'https://accounts.spotify.com/authorize';
authorizeURL += '?response_type=token';
authorizeURL += '&client_id=' + encodeURIComponent(clientID);
authorizeURL += '&scope=' + encodeURIComponent(scope);
authorizeURL += '&redirect_uri=' + encodeURIComponent(redirectURI);
// authorizeURL += '&state=' + encodeURIComponent(state);

let accessToken

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const urlToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiration = window.location.href.match(/expires_in=([^&]*)/)
        if (urlToken && urlExpiration) {
            accessToken = urlToken[1];
            const expiresIn = Number(urlExpiration[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/')
            return accessToken;
        } else {
            window.location = authorizeURL;
        }
        
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    }
}

export default Spotify;