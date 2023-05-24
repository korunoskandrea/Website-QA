const drawerButton = document.querySelector('#drawerButton')
const drawerContainer = document.querySelector('.drawer-container')
const logoutButton = document.querySelector('#logout-btn')

drawerButton.addEventListener('click', (event) => {
    drawerContainer.style.display = 'block'
})

drawerContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('drawer-container')) {
        drawerContainer.style.display = 'none'
    }
})

logoutButton.addEventListener('click', () => {
    localStorage.clear()
})

