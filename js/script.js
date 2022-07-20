window.addEventListener('DOMContentLoaded', () => {

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

					if(target && target.classList.contains('tabheader__item')) {
							tabs.forEach((item, i) => {
								if(target == item){
									hideTapContent();
									showTabContent(i);		
								}
							})
					}
			})

})