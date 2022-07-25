window.addEventListener('DOMContentLoaded', () => {


	//  Tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTapContent() {
		tabsContent.forEach(i => {
			i.style.display = 'none';
		})

		tabs.forEach(tab => {
			tab.classList.remove('tabheader__item_active');
		})
	}

	function showTabContent(i = 0) {
		tabsContent[i].style.display = 'block';
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTapContent();
	showTabContent();



	tabsParent.addEventListener('click', (e) => {
		const target = e.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTapContent();
					showTabContent(i);
				}
			})
		}
	})


	// Timer


	const deadline = '2022-08-17';

	let days, hours, minutes, seconds;
	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t <= 0) {
			days = 0,
				hours = 0,
				minutes = 0,
				seconds = 0;
		} else {
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
				hours = Math.floor((t / (1000 * 60 * 60) % 24)),
				minutes = Math.floor((t / 1000 / 60) % 60),
				seconds = Math.floor((t / 1000) % 60);
		}
		return {
			'total': t,
			seconds,
			hours,
			minutes,
			days,
		};
	}


	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}

	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds');
		timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
	setClock('.timer', deadline);


	// Модальное окно

	const buttonsOpenModal = document.querySelectorAll('[data-modal]');
	const modal = document.querySelector('.modal');
	buttonsOpenModal.forEach(i => {
		i.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.style.display = 'none';
		document.body.style.overflow = 'scroll';
	}

	// Таймаут модального окна
	const modalInterval = setTimeout(openModal, 10000);

	function openModal() {
		document.body.style.overflow = 'hidden';
		modal.style.display = 'block';
		window.removeEventListener('scroll', checkScroll);
		clearInterval(modalInterval);

		window.addEventListener('click', (e) => {
			if (window.getComputedStyle(modal).display == 'block' && e.target == modal || e.target.getAttribute('data-close') == '') {
				closeModal();
			}
		});

		window.addEventListener('keydown', (e) => {
			if (e.code == 'Escape' && window.getComputedStyle(modal).display == 'block') {
				closeModal();
			}
		})
	}
	console.log(scrollY)

	// Scroll Open Modal
	window.addEventListener('scroll', checkScroll);
	function checkScroll() {
		if (scrollY > 3000) {
			openModal();
		}
	};

	// Конструктор айтемов
	const par = document.querySelector('.menu__field .container')


	class ItemsProduct {
		constructor(photo, title, text, price, ...classes) {
			this.photo = photo;
			this.title = title;
			this.text = text;
			this.price = price;
			this.classes = classes;
		}

		createHTML(parent) {
			const item = document.createElement('div');
			this.classes.forEach(className => item.classList.add(className));
			item.innerHTML = `
			<img src=${this.photo} alt="vegy">
			<h3 class="menu__item-subtitle">${this.title}"</h3>
			<div class="menu__item-descr">${this.text}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
				<div class="menu__item-cost">Цена:</div>
				<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
			</div>`
			parent.insertAdjacentElement('beforeend', item);
		}
	}

	const getResources = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}
		return await res.json();
	};

	// getResources('http://localhost:3000/menu')
	// 	.then(data => {
	// 		console.log(data);
	// 		data.forEach(({ img, title, descr, price }) => {
	// 			new ItemsProduct(img, title, descr, price, 'menu__item').createHTML(par);
	// 		});
	// 	});

	axios.get('http://localhost:3000/menu')
		.then(data => {
			data.data.forEach(({ img, title, descr, price }) => {
				new ItemsProduct(img, title, descr, price, 'menu__item').createHTML(par);
			});
		});

	const forms = document.querySelectorAll('form');
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		bindPostData(item);
	});


	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				'Content-type': 'application/json',
			},
			body: data,
		});

		return await res.json();
	};


	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
						display: block;
						margin: 0 auto;
				  `;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData(' http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				})
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
				  <div class="modal__content">
						<div class="modal__close" data-close>×</div>
						<div class="modal__title">${message}</div>
				  </div>
			 `;
		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}

	fetch('http://localhost:3000/menu')
		.then(data => data.json())
		.then(res => console.log(res))


	// Slider 

	const sliders = document.querySelectorAll('.offer__slide');
	const totalSlides = document.querySelector('#total');
	const currentSlides = document.querySelector('#current');
	const prevButton = document.querySelector('.offer__slider-prev');
	const nextButton = document.querySelector('.offer__slider-next');
	const slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slidder-inner'),
		width = window.getComputedStyle(slidesWrapper).width;


	let currSlide = 1;
	let offset = 0;

	if (sliders.length < 10) {
		totalSlides.textContent = `0${sliders.length}`;
		currentSlides.textContent = `0${currSlide}`;
	} else {
		totalSlides.textContent = sliders.length
		currentSlides.textContent = currSlide;
	};

	slidesField.style.width = 100 * sliders.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';
	sliders.forEach(slide => {
		slide.style.width = width;
	});


	nextButton.addEventListener('click', prevClick);

	prevButton.addEventListener('click', backclick);


	function prevClick() {
		if (offset == +width.slice(0, width.length - 2) * (sliders.length - 1)) {
			offset = 0;
		} else {
			offset += +width.slice(0, width.length - 2);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (currSlide == sliders.length) {
			currSlide = 1;
			changeIndicatorSlides(currSlide);
		} else {
			currSlide++;
			changeIndicatorSlides(currSlide);
		}

		if (sliders.length < 10) {
			currentSlides.textContent = `0${currSlide}`;
		} else {
			currentSlides.textContent = currSlide;
		}
	}

	function backclick() {
		if (offset == 0) {
			offset = +width.slice(0, width.length - 2) * (sliders.length - 1);
		} else {
			offset -= +width.slice(0, width.length - 2);
		}

		if (currSlide == 1) {
			currSlide = sliders.length;
			changeIndicatorSlides(currSlide);
		} else {
			currSlide--;
			changeIndicatorSlides(currSlide);
		}

		if (sliders.length < 10) {
			currentSlides.textContent = `0${currSlide}`;
		} else {
			currentSlides.textContent = currSlide;
		}

		slidesField.style.transform = `translateX(-${offset}px)`;
	}
	const carouselIndicator = document.createElement('ul');
	carouselIndicator.classList.add('carousel-indicators');
	slidesWrapper.insertAdjacentElement('beforeend', carouselIndicator);
	for (i = 1; i <= sliders.length; i++) {
		const dots = document.createElement('li');
		dots.classList.add('dot');
		dots.id = `${i}dot`
		carouselIndicator.insertAdjacentElement('beforeend', dots);
	}


	function changeIndicatorSlides(slide) {
		const dots = document.querySelectorAll('.dot');
		dots.forEach(item => {
			item.classList.remove('active_dot');
			if (item.id == `${slide}dot`) {
				item.classList.add('active_dot');
			}
		})
	}
	changeIndicatorSlides(currSlide);
	// totalSlides.textContent = `0${sliders.length}`;
	// prevButton.addEventListener('click', (e) => {
	// 	if (currSlide > 1) {
	// 		currSlide -= 1;
	// 		showSlide();
	// 	}
	// })
	// nextButton.addEventListener('click', (e) => {
	// 	if (currSlide == sliders.length) {
	// 		currSlide = 0;
	// 	}
	// 	currSlide++;
	// 	showSlide();
	// })
	// showSlide()
	// function showSlide() {
	// 	sliders.forEach(item => {
	// 		item.classList.remove('show');
	// 		item.classList.add('hide');
	// 	})
	// 	sliders[currSlide - 1].classList.add('show');
	// 	currentSlides.innerText = `0${currSlide}`;
	// }
	// setInterval(() => {
	// 	showSlide();
	// 	if (currSlide == sliders.length) {
	// 		currSlide = 0;
	// 	}
	// 	currSlide++;
	// }, 3000)


	setInterval(prevClick, 3000);

	carouselIndicator.addEventListener('click', (e) => {
		if (e.target.classList.contains('dot')) {
			let dots = document.querySelectorAll('.dot');
			dots.forEach(item => {
				item.classList.remove('active_dot');
			})
			e.target.classList.add('active_dot');
			console.log(e.target.id)
			const nextSlide = parseInt(e.target.id);

			offset = +width.slice(0, width.length - 2) * (nextSlide - 1);
			slidesField.style.transform = `translateX(-${offset}px)`;

			currSlide = nextSlide;
			if (sliders.length < 10) {
				currentSlides.textContent = `0${currSlide}`;
			} else {
				currentSlides.textContent = currSlide;
			}
		}
	})
});
