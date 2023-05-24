const links = document.querySelectorAll('a');
const mustBeLoggedInItems = document.querySelectorAll('.logged-in');
const mustNotBeLoggedInItems = document.querySelectorAll('.not-logged-in');

fetch(location.href, {
    headers: {
        'Authorization': localStorage.getItem('token')
    }
}).then(response => {
    if (response.status !== 200) {
        location.href = '/';
    }
});


mustBeLoggedInItems.forEach(item => {
    if (!localStorage.getItem('token')) {
        item.style.display = 'none'
    }
});

mustNotBeLoggedInItems.forEach(item => {
    if (localStorage.getItem('token')) {
        item.style.display = 'none'
    }
});

const exp = localStorage.getItem('exp')
if (exp) {
    const remainingTime = exp - Math.floor(new Date().getTime() / 1000);
    if (remainingTime <= 0) logout();
    setTimeout(logout, remainingTime * 1000);
}

links.forEach((link) => {
   link.addEventListener('click', async (event) => {
       event.preventDefault() // 1. preprecima posiljanje (prvzeto) requesta
       const aTag = link; // 2.
       const href = aTag.href; // 2. pridobi link kam smo hotli it -posiljat request
       const token = localStorage.getItem('token') ?? 'Bearer i';
       console.log(href)
       location.href = `${href}?token=${token.split(' ')[1]}`;
   });
});


function logout() {
    localStorage.clear();
    alert('Login time has expired please login again');
    window.location.href = '/auth/login';
}
