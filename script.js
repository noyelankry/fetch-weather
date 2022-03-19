
let input = document.getElementById('artist-input')
console.log(input)
input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        // event.preventDefault()
        // document.getElementById('search-btn').click()
        searchArtist()
    }
})

function searchArtist() {
    //delete the results for the previous search
    document.getElementsByClassName('albums')[0].innerHTML = ''

    //get artist name from the input value and transform it to lowercase
    let artistName = document.getElementsByClassName('artist-input')[0].value
    artistName = artistName.toLowerCase()
    //if the artist name is empty the page will reload
    if (artistName === '') {
        document.location.reload()
    }
    document.getElementById('search-btn').setAttribute('disabled', true)

    if (document.getElementsByName('API')[0].checked) {
        //turn whitespaces to dashes
        artistName = artistName.replace(/\s/g, '-')
        console.log(artistName)
        fetch(`https://itunes.apple.com/search?term=${artistName}`)
            .then(response => {
                response.json().then(data => {
                    console.log('data', data)

                    for (i = 0; i < data.results.length; i++) {
                        let newLine = document.createElement('div')
                        newLine.classList.add('album-name')
                        newLine.innerHTML = `${i + 1}. 
                        <strong>Artist Name</strong>: ${data.results[i].artistName} <br>
                        <strong>Album Name</strong>: ${data.results[i].collectionName} <br>
                        <strong>Listen Now (Preview)</strong>:
                        <div>
                            <audio src=${data.results[i].previewUrl} controls class='audio-player' /> 
                        </div> <br>
                        <img src='${data.results[i].artworkUrl100}' class = 'artwork-img'/> <br><br>`
                        document.getElementsByClassName('albums')[0].append(newLine)
                    }
                    document.getElementById('search-btn').removeAttribute('disabled')
                    if (document.getElementsByClassName('album-name').length != 0) {
                        if (document.getElementById('panda') !== null) {
                            document.getElementById('panda').remove()
                            document.getElementById('listen-to').remove()
                        }
                    }
                })
            })
    } else {
        //turn whitespaces to %20
        artistName = artistName.replace(/\s/g, '%20')
        console.log(artistName)
        const clientId = '1866bcd156c04721bd5d669b75a0d5f7'
        const clientSecret = '3418b612e667483096772b57fb704ddb'

        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        }).then(response => {
            response.json().then(data => {
                token = (data.access_token)
                console.log(token)
                fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=album`, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }
                }).then(response1 => {
                    response1.json().then(data1 => {
                        console.log('data1', data1.albums.items)
                        console.log('data2', (data1.albums.items.length))

                        for (i = 0; i < data1.albums.items.length; i++) {
                            let newLine = document.createElement('div')
                            newLine.classList.add('album-name')
                            newLine.innerHTML = `${i + 1}. 
                            <strong>Artist Name</strong>: ${data1.albums.items[i].artists[0].name} <br>
                            <strong>Album Name</strong>: ${data1.albums.items[i].name} <br>
                            <strong> Listen on Spotify </strong>:
                                <a href=${data1.albums.items[i].external_urls.spotify} class='click-here' target = "_blank"> 
                                    Click here!
                                <a/><br>
                            <img src="${data1.albums.items[i].images[0].url}" class='artwork-img'/>
                            <br><br>`
                            document.getElementsByClassName('albums')[0].append(newLine)
                        }
                        document.getElementById('search-btn').removeAttribute('disabled')
                        if (document.getElementsByClassName('album-name').length != 0) {
                            if (document.getElementById('panda') !== null) {
                                document.getElementById('panda').remove()
                                document.getElementById('listen-to').remove()
                            }
                        }
                    })
                })

            })
        })
    }
    //clear search input
    document.getElementsByClassName('artist-input')[0].value = ''
}

