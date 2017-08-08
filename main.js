function Container(my_id, my_class, my_name) {
	this.my_id = my_id;
	this.my_class = my_class;
	this.my_name = my_name;
};
Container.prototype.render = function() {
	return this.htmlCss;
};
function Trumbnail(trumb_wrapper_class, trumb_class, trumb_items) {
	Container.call(this);
	this.trumb_wrapper_class = trumb_wrapper_class;
	this.trumb_class = trumb_class;
	this.trumb_items = trumb_items;
};
Trumbnail.prototype = Object.create(Container.prototype);
Trumbnail.prototype.constructor = Trumbnail;
Trumbnail.prototype.render = function() {
	var result = '<div class="'+ this.trumb_wrapper_class +'">';
	for (var key in this.trumb_items) {
		result += '<img class="' + this.trumb_class + '" src="' + this.trumb_items[key].src_trumb +'">'
	}
	return result += '</div>';
};
function BigPicture(big_class, big_src) {
	Container.call(this);
	this.big_class = big_class;
	this.big_src = big_src;
};
BigPicture.prototype = Object.create(Container.prototype);
BigPicture.prototype.render = function() {
	var bigPictureWrapper = document.createElement('div');
	bigPictureWrapper.classList.add(this.big_class);
	var image = document.createElement('img');
	image.src = this.big_src;
	bigPictureWrapper.appendChild(image);
	return bigPictureWrapper;

	// var result = '<div class="' + this.big_class +'">';
	// result += '<img src="' + this.big_src + '">'
	// return result += '</div>';
};

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = checkstage;

function checkstage() {
	if(xhr.readyState == XMLHttpRequest.DONE) {
		if(xhr.status == 200) {
			var answer = JSON.parse( xhr.responseText );
			var trumbnail = new Trumbnail('trumb_wrapper', 'trumb', answer);
			document.body.innerHTML = trumbnail.render();

			var srcFirstBigPicture = answer[0].src_big;
			var bigPicture = new BigPicture('big_wrapper', srcFirstBigPicture);

			document.body.appendChild( bigPicture.render() );

			var trump_wrapper = document.getElementsByClassName('trumb_wrapper')[0];
			console.log(trump_wrapper);
			trump_wrapper.onclick = function(e) {
				var targetSrc = e.target.src;
				for(var key in answer) {
					if( targetSrc.indexOf( answer[key].src_trumb ) != -1 ) {
						var newSrcBigPicture = answer[key].src_big;
						var big_wrapper = document.getElementsByClassName('big_wrapper')[0];
						big_wrapper.parentNode.removeChild(big_wrapper);
						bigPicture = null;
						bigPicture = new BigPicture('big_wrapper', newSrcBigPicture);
						document.body.appendChild( bigPicture.render() );


					}
				}
			}
			// trump_wrapper.addEventListner("click", function(e) {
			// 	var targetSrc = e.target.src;
			// 	console.log(targetSrc);
			// } , false);
		}
	}
};
xhr.open('get', 'sendjson.php', true);
xhr.send(null);
xhr.timeout = 10000;
xhr.ontimeout = function() {
	console.log('Слишком долго, что-то пошло не так(');
};