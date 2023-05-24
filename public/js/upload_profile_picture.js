const addImageButton = document.querySelector('.add-img-btn');
const imageSelectInput = document.querySelector('#img-select');
const uploadedImagesList = document.querySelector('.uploaded-images-list');
const removeImageButtons = document.querySelectorAll('.remove-img-btn');
const saveChangesBtn = document.querySelector('#save-changes-btn')

addImageButton.addEventListener('click', () => {
    imageSelectInput.click();
});

imageSelectInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
        const imgPreview = createImgPreview(file);
        uploadedImagesList.appendChild(imgPreview);
    }
});

function createImgPreview(file) {
    const container = document.createElement('div');
    container.className = 'img-preview'

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const uploadedFile = new File([file], file.name, {
        type: file.type,
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(uploadedFile);

    const img = document.createElement('img');
    img.className = 'uploaded-img';
    img.src = URL.createObjectURL(file);

    container.appendChild(overlay);
    container.appendChild(img);
    return container;
}

saveChangesBtn.addEventListener('click', async (event) => {
    const file = imageSelectInput.files[0]
    const fileEncoded = await toBase64(file);

    const response = await fetch(
        `/api/upload-profile`,
        {
            method: "PATCH",
            mode: 'cors',
            headers: { // kaj se poslje
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                file: fileEncoded
            })
        }
    )
});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});