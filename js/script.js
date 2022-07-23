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
	new ItemsProduct(
		'img/tabs/vegy.jpg',
		'Здоровье',
		'Хочешь быть здоровым, пей корову',
		250, 'menu__item').createHTML(par);

	new ItemsProduct('img/tabs/vegy.jpg',
		'Здоровье',
		'Хочешь быть здоровым, пей корову',
		250, 'menu__item').createHTML(par);

	const forms = document.querySelectorAll('form');
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		postData(item);
	});

	function postData(form) {
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

			const object = {};
			formData.forEach(function (value, key) {
				object[key] = value;
			});

			fetch('server.php', {
				method: "POST",
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify(object),
			})
				.then(data => data.text())
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
});
