function loadAlbuns(albuns) {

	let content = '';
	const div = document.getElementById('albuns-div');

	albuns.forEach(album => {

		content +=
			`<div class="card-container px-2 my-2 col-lg-3 col-md-4 col-sm-6">
				<a href="pages/detalhes.html?album=${album.id}">
				<div class="card">
					<img src="${album.cover}" class="card-img-top" alt="">
					<div class="card-body">
						<h5 class="card-title">${album.title}</h5>
						<p>${album.subtitle}</p>
					</div>
				</div>
				</a>
			</div>`;
	})

	div.innerHTML = content;
}

function loadAlbum(pictures, album) {

	pictures = pictures.filter(picture => (picture.id_album == album.id));
	
	let content = '';
	const div = document.getElementById('pictures');
	const btnHighLight = document.getElementById('highlight-btn');
	const carouselInner = document.querySelector('.carousel-inner');

	document.querySelector("title").innerHTML = album.title;
	document.getElementById("album-name").innerHTML = album.title;
	document.getElementById("album-picture").src = `../${album.cover}`;
	document.getElementById("album-desc").innerHTML = album.desc;
	document.getElementById("album-location").innerHTML = album.location;
	document.getElementById("album-date").innerHTML = album.date;
	document.getElementById("url-destaque").value = album.url_destaque;

	if(album.highlight){
		btnHighLight.classList.add('bi-heart-fill');
	}
	else{
		btnHighLight.classList.add('bi-heart');
	}
	
	pictures.forEach(picture => {

		content +=
			`<div class="card-container px-2 my-2 col-lg-3 col-md-4 col-sm-6">
				<div class="card" onclick="addActive('item-${picture.id}')">
					<img src="${picture.url}" class="card-img-top" alt="">
					<div class="card-body">
						<h5 class="card-title">${picture.desc}</h5>
						<p class="card-text">${picture.year}</p>
					</div>
				</div>
			</div>`;
	})

	div.innerHTML = content;

	content = '';

	pictures.forEach(picture => {

		content +=
			`<div id="item-${picture.id}" class="carousel-item">
				<img src="${picture.url}" class="d-block w-100 rounded" alt="...">
				<div class="carousel-caption d-none d-md-block">
					<h5>${picture.desc}</h5>
					<p>${picture.year}</p>
				</div>
			</div>`;
	})

	carouselInner.innerHTML = content;
}

function loadDestaques(destaques){

	let content = '';
	let indicators = '';
	const div = document.getElementById('div-carousel');
	const carouselIndicators = document.querySelector('.carousel-indicators');

	destaques.forEach((destaque, index) =>{
		if(index == 0){
			content += 
				`<div class="carousel-item active">
					<a href="pages/detalhes.html?album=${destaque.id_album}">
						<img src="${destaque.url}" class="d-block w-100"
							alt="${destaque.title}">
					</a>
					<div class="carousel-caption d-none d-md-block">
						<h5>${destaque.title}</h5>
					</div>
				</div>`;

			indicators +=
				`<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="active"
                aria-current="true" aria-label="Slide ${index + 1}"></button>`;
		}
		else{
			content += 
			`<div class="carousel-item">
				<a href="pages/detalhes.html?album=${destaque.id_album}">
					<img src="${destaque.url}" class="d-block w-100"
						alt="${destaque.title}">
				</a>
				<div class="carousel-caption d-none d-md-block">
					<h5>${destaque.title}</h5>
				</div>
			</div>`;

			indicators +=
				`<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}"
				aria-current="true" aria-label="Slide ${index + 1}"></button>`;
		}
	})

	div.innerHTML = content;
	carouselIndicators.innerHTML = indicators;
}

function loadMap(albuns){
	const centralLatLong= [-10,10];

	mapboxgl.accessToken = MAPBOXGL_ACCESS_TOKEN;
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/navigation-night-v1',
		center: centralLatLong,
		zoom: 2
	});

	albuns.forEach (album => {
		var popup = new mapboxgl.Popup({ offset: 25 })
			.setHTML(`<h5><a href="pages/detalhes.html?album=${album.id}" target="_blank">${album.title}</a></h5><br>
					  <h6>${album.location}</h6>`);
		const marker = new mapboxgl.Marker()
			.setLngLat(album.latLong)
			.setPopup(popup)
			.addTo(map);     
	}) ;
}

function highlight(obj){
	if(obj.classList.contains('bi-heart-fill')){
		obj.classList.remove('bi-heart-fill');
		obj.classList.add('bi-heart');

		deleteDestaque(albumId);
		updateAlbum(albumId, {highlight: false});
	}
	else{
		obj.classList.remove('bi-heart');
		obj.classList.add('bi-heart-fill');

		destaque = {
			id: parseInt(albumId),
			url: document.getElementById('url-destaque').value,
			id_album: parseInt(albumId),
			title: document.getElementById('album-name').innerHTML
		};

		createDestaque(destaque);
		updateAlbum(albumId, {highlight: true});
	}
}  

//funcoes para exibir mensagens na tela
function displaySuccsMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML =
        `<div class="alert alert-success alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

function displayErrMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML =
        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

/*
	CRUD
*/

//Albuns
function readAlbuns(){
	fetch(`${apiUrl}/albuns`, {
		method: 'GET',
        headers: { 'Content-Type': 'application/json' },	
	})
    .then(res => res.json())
    .then(data => {
		loadAlbuns(data);
		loadMap(data);;
	})
    .catch(error => {
        console.error(error);
    })
}

function updateAlbum(id, album){
	fetch(`${apiUrl}/albuns/${id}`, {
		method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(album)
	})
    .catch(error => {
		console.error(error);
    })
}

//fotos
function readPictures(id){
	fetch(`${apiUrl}/pictures`, {
		method: 'GET',
        headers: { 'Content-Type': 'application/json' }
	})
    .then(res => res.json())
    .then(pics => {
		fetch(`${apiUrl}/albuns/${id}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		.then(res => res.json())
		.then(album => loadAlbum(pics, album))
		.catch(error => {
			console.error(error);
		})
	})
    .catch(error => {
        console.error(error);
    })
}

//destaques
function createDestaque(destaque){
	fetch(`${apiUrl}/destaques`, {
		method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destaque)

	})
    .then(res => { 
        if(res.status == 201) displaySuccsMessage('Álbum adicionado aos destaques!');
        else displayErrMessage('Não foi possível adicionar o álbum aos destaques');
    })
    .catch(error => {
        console.error("ERRO " + error);
    })
}

function readDestaques(){
	fetch(`${apiUrl}/destaques`, {
		method: 'GET',
        headers: { 'Content-Type': 'application/json' }
	})
    .then(res => res.json())
    .then(data => loadDestaques(data))
    .catch(error => {
        console.error(error);
    })
}

function deleteDestaque(id){
	fetch(`${apiUrl}/destaques/${id}`, {
		method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
	})
    .then(res => {
        if(res.status == 200) displaySuccsMessage('Álbum removido dos destaques!');
        else displayErrMessage('Não foi possível remover o álbum dos destaques');
    })
    .catch(error => {
        console.error(error);
    })
}
