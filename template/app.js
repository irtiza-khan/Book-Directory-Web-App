var loadFile = function(event) {
    console.log(event);
    const displayImage = document.querySelector('.display-image')
    const source = URL.createObjectURL(event.target.files[0]);
    displayImage.innerHTML = `
    <img class="card-img-top " src=${source}  " width="200 "/>
    `

};