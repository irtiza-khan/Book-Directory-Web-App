var loadFile = function(event) {
    console.log(event);
    const displayImage = document.querySelector('.display-image')
    const source = URL.createObjectURL(event.target.files[0]);
    displayImage.innerHTML = `
    <img class="card-img-top " src=${source}  " width="200 "/>
    `

};


// //Google Book Api

// function booksApi() {
//     const apiKey = 'AIzaSyCxb6miyHTSxIRJFeKIkGiv6SNPfWvHWr0';
//     fetch(`https://www.googleapis.com/books/v1/volumes?q=search-terms&key=${apiKey}`)
//         .then(response => response.json())
//         .then(result => {
//             bookRequest(result);
//         });
// }

// //Sending data to the backend
// const bookRequest = async(data) => {
//     try {
//         const res = await axios.post('/add-book', data);
//         console.log(res.data);

//     } catch (err) {

//         console.log('Some erro Occured');
//     }

// }



// booksApi();