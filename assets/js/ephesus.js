function toggleNightMode(){
	if(document.documentElement.getAttribute('data-theme') == 'dark'){
		document.documentElement.setAttribute('data-theme', 'light');
		document.getElementById('mode-switcher').classList.add('active');
		localStorage.setItem("theme","light");
	}
	else{
		document.documentElement.setAttribute('data-theme', 'dark');
		document.getElementById('mode-switcher').classList.remove('active');
		localStorage.setItem("theme","");
	}
}