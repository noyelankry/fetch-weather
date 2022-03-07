
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
    //turn whitespaces to dashes
    artistName = artistName.replace(/\s/g, '-')
    console.log(artistName)
    //if the artist name is empty the page will reload
    if (artistName === '') {
        document.location.reload()
    }
    document.getElementById('search-btn').setAttribute('disabled', true)
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
                    <div>
                        <audio src=${data.results[i].previewUrl} controls class='audio-player' /> 
                    </div> <br>`
                    document.getElementsByClassName('albums')[0].append(newLine)
                }
                document.getElementById('search-btn').removeAttribute('disabled')
                if (document.getElementsByClassName('album-name').length != 0) {
                    document.getElementById('panda').remove()
                    document.getElementById('listen-to').remove()
                }
            })
        })
    //clear search input
    document.getElementsByClassName('artist-input')[0].value = ''
}

