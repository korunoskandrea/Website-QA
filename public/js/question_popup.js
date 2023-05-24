const fabButton = document.querySelector('.fab');
const overlay = document.querySelector('.overlay');
const createQuestionBtn = document.querySelector('#create-question-btn');
const allQuestions = document.querySelector('.all-questions');
const deleteQuestionButtons = document.querySelectorAll('.delete-question');
const showLabelDialog = document.querySelector('#show-label-popup')

const selectedLabels = [];


async function deleteAnswerInList(event, id) {
    const response = await fetch(
        `/myQuestions/deleteAnswer/${id}`,
        {
            method: "DELETE",
            mode: 'cors',
            headers: { // kaj se poslje
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }
    );
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
}

fetch(
    `/api/me`,
    {
        method: "GET",
        mode: 'cors',
        headers: { // kaj se poslje
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
    }
).then(async res => {
    const user = (await res.json()).user;
    document.body.dataset.uid = user.userId;
    // Set delete buttons
    const answers = document.querySelectorAll('.just_answers_card')
    for (const answer of answers) {
        if (answer.dataset.uid == user.userId) {
            const delButton = document.createElement('button')
            delButton.textContent = 'Delete'
            delButton.className = 'btn btn-danger'
            delButton.addEventListener('click', async event => await deleteAnswerInList(event, answer.dataset.id))
            answer.appendChild(delButton)
        }
    }
});

fabButton.addEventListener('click',(event) => {
    overlay.style.display = 'block';
});

overlay.addEventListener('click', (event) => {
    if (event.target.classList.contains('overlay')) {
        overlay.style.display = 'none';
        return;
    }
    console.log('Clicking work area...');
})

createQuestionBtn.addEventListener('click', async () => {
    const questionTitle = document.querySelector('#title');
    const questionDescription = document.querySelector('#q-description');
    console.log(questionDescription)
    console.log(questionDescription.value)
    const response = await fetch(
        `/api/create/question`,
        {
            method: "POST",
            mode: 'cors',
            headers: { // kaj se poslje
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                title: questionTitle.value,
                description: questionDescription.value,
                labels: selectedLabels,
            })
        }
    );
    if (response.status === 201) {
        location.reload()
    } else if (response.status === 401) {
        alert('You have to be logged in to ask a question');
    }
    overlay.style.display = 'none';
})

deleteQuestionButtons.forEach(deleteQuestion => {
    deleteQuestion.addEventListener('click', async (event) => {
        const id = event.target.parentNode.parentNode.querySelector('.q-id').value;
        const response = await fetch(
            `/myQuestions/${id}`,
            {
                method: "DELETE",
                mode: 'cors',
                headers: { // kaj se poslje
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
        );
        if (response.status === 200) {
            event.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.parentNode.parentNode)
        }
    })
});

showLabelDialog.addEventListener('click', async (event) => {
    // Save old htm
    const qTitle = overlay.querySelector('.question-title');
    const qDescription = overlay.querySelector('.question-description');
    const qLabels = overlay.querySelector('.question-labels');
    const qFooter = overlay.querySelector('.question-footer');
    // Clear current dialog html
    let currentDialogContent = document.querySelector('.create-question')
    currentDialogContent.querySelector('.question-header').textContent = 'Choose labels'
    currentDialogContent.removeChild(overlay.querySelector('.question-title'));
    currentDialogContent.removeChild(overlay.querySelector('.question-description'));
    currentDialogContent.removeChild(overlay.querySelector('.question-labels'));
    currentDialogContent.removeChild(overlay.querySelector('.question-footer'));
    // Add html for creating labels
    const searchBar = document.createElement('input');
    searchBar.type = 'search'
    searchBar.className = 'form-control';
    searchBar.placeholder = 'Search by label name...';

    const labelsContainer = document.createElement('div')
    labelsContainer.className = 'label-list'
    const labels = await getAllLabels()
    labels.forEach(label => {
        const labelContainer = document.createElement('div');
        labelContainer.style.background = label.color;
        labelContainer.textContent = label.text;
        labelContainer.style.borderRadius = '25px';
        labelContainer.style.margin = '15px auto';
        labelContainer.style.padding = '5px 15px';

        const index = selectedLabels.findIndex(el => el.text === label.text)
        if (index >= 0) {
            labelContainer.style.border = `3px solid black`
        } else {
            labelContainer.style.border = `none`;
        }

        labelContainer.addEventListener('click', () => {
            const index = selectedLabels.findIndex(el => el.text === label.text)
            if (index >= 0) {
                selectedLabels.splice(index, 1);
                labelContainer.style.border = `none`;
            } else {
                labelContainer.style.border = `3px solid black`
                selectedLabels.push(label);

            }
        })

        labelsContainer.appendChild(labelContainer)

    })

    const newLabelContainer = document.createElement('div');
    newLabelContainer.className = 'new-label-container';
    newLabelContainer.style.border = "2px solid black";
    newLabelContainer.style.borderRadius = '25px';
    newLabelContainer.style.width = '100%';
    newLabelContainer.style.margin = '20px auto';
    newLabelContainer.style.padding = '10px';
    newLabelContainer.style.display = 'flex';

    const newLabelNameField = document.createElement('input')
    newLabelNameField.className = 'form-control new-label-name';
    newLabelNameField.placeholder = 'New label name...';
    newLabelNameField.style.background = 'transparent';
    newLabelNameField.style.display = 'block';
    newLabelNameField.style.border = 'none';
    newLabelNameField.style.width = '100%';

    const colorPicker = document.createElement('div')
    newLabelNameField.className = 'color-picker';
    newLabelNameField.placeholder = 'New label name...';
    newLabelNameField.style.background = 'transparent';
    newLabelNameField.style.outline = 'none';

    newLabelContainer.appendChild(newLabelNameField);
    newLabelContainer.appendChild(colorPicker);

    currentDialogContent.append(searchBar)
    currentDialogContent.append(labelsContainer)
    currentDialogContent.append(document.createElement('hr'))
    currentDialogContent.append(newLabelContainer)
    currentDialogContent.append(colorPicker)

    const pickr = createPicker()
    pickr.on('change', () => {
        newLabelContainer.style.background = pickr.getColor().toHEXA().toString();
    });

    const addNewLabelButton = document.createElement('button');
    addNewLabelButton.className = 'btn btn-primary'
    addNewLabelButton.textContent = 'Add Label'
    addNewLabelButton.addEventListener('click', async event => await onCreateNewLabel(event));

    currentDialogContent.append(addNewLabelButton)
    currentDialogContent.append(document.createElement('hr'))

    const doneButton = document.createElement('button');
    doneButton.className = 'btn btn-success'
    doneButton.textContent = 'Done'
    doneButton.addEventListener('click', (event) => {
        currentDialogContent.querySelector('.question-header').textContent = 'Ask something...'
        currentDialogContent.removeChild(searchBar);
        currentDialogContent.removeChild(labelsContainer);
        currentDialogContent.removeChild(currentDialogContent.querySelector('hr'));
        currentDialogContent.removeChild(currentDialogContent.querySelector('hr'));
        currentDialogContent.removeChild(newLabelContainer);
        currentDialogContent.removeChild(colorPicker);
        currentDialogContent.removeChild(addNewLabelButton);
        currentDialogContent.removeChild(doneButton);

        currentDialogContent.appendChild(qTitle);
        currentDialogContent.appendChild(qDescription);
        currentDialogContent.appendChild(qLabels);
        const selectedItems = qLabels.querySelector('.selected-items-list');
        while (selectedItems.firstChild) {
            selectedItems.removeChild(selectedItems.firstChild);
        }
        selectedLabels.forEach(label => {
           const labelContainer = document.createElement('div')
            labelContainer.style.width = '15%';
            labelContainer.style.background = label.color;
            labelContainer.textContent = label.text;
            labelContainer.style.borderRadius = '25px';
            labelContainer.style.padding = '5px 10px';
            labelContainer.style.margin = '0 10px';
            selectedItems.appendChild(labelContainer)
        });

        currentDialogContent.appendChild(qFooter);
    })
    currentDialogContent.append(doneButton);

});


async function onCreateNewLabel(event) {
    const name = document.querySelector('.color-picker').value;
    const color = document.querySelector('.new-label-container').style.background;
    const response = await fetch('/api/create/label', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            text: name,
            color: color,
        })
    });
    if (response.status === 201) {
        const newLabel = (await response.json()).label;
        const labelContainer = document.createElement('div');
        labelContainer.style.background = newLabel.color;
        labelContainer.textContent = newLabel.text;
        labelContainer.style.borderRadius = '25px';
        labelContainer.style.margin = '15px auto';
        labelContainer.style.padding = '5px 15px';
        labelContainer.addEventListener('click', () => {
            const index = selectedLabels.findIndex(el => el.text === newLabel.text)
            if (index >= 0) {
                selectedLabels.splice(index, 1);
                labelContainer.style.border = `none`;
            } else {
                labelContainer.style.border = `3px solid black`
                selectedLabels.push(newLabel);

            }
        })
        document.querySelector('.label-list').appendChild(labelContainer)
    }
}

function createPicker() {
    const pickr = Pickr.create({
        el: '.color-picker',
        useAsButton: true,
        theme: 'classic', // or 'monolith', or 'nano'
        default: '#FFFFFF',
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],

        components: {
            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true,
                clear: true,
                save: true
            }
        }
    });
    return pickr
}

async function getAllLabels() {
    const response = await fetch('/api/labels', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': localStorage.getItem('token')
        },
    });
    return (await response.json()).labels
}


const filterBar = document.querySelector('.filter-bar')
const filterBarAddFilterBtn = document.querySelector('#add-filter')
let filters = []
filterBarAddFilterBtn.addEventListener('click', event => {
    const filterBarInput = document.querySelector('#filter-text')
    if (filterBarInput.value.trim().length !== 0) {
        filters.push(filterBarInput.value.trim())
        const newFilterP = document.createElement('p')
        newFilterP.textContent = filterBarInput.value.trim()
        newFilterP.style.border = "2px solid black";
        newFilterP.style.padding = "5px 10px";
        newFilterP.style.borderRadius = "15px";

        const removeFilter = document.createElement('button')
        removeFilter.textContent = 'X'
        removeFilter.className = 'btn btn-danger'
        removeFilter.style.scale = '0.9'
        removeFilter.style.marginLeft = '5px'
        removeFilter.addEventListener('click', event => {
            const filterIndex = filters.findIndex(filterName => filterName === event.target.parentNode.textContent.replace('X', ''))
            filters.splice(filterIndex, 1);
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            filterQuestions()
        })

        newFilterP.appendChild(removeFilter)
        filterBar.querySelector('.active-filters').appendChild(newFilterP)
    }
    filterQuestions()
});


function filterQuestions() {
    console.log(filters)
    allQuestions.children.forEach(question => {
        let filterMatch = 0;
        filters.forEach(filter => {
            const labels = [...question.querySelectorAll('.q-label')].map(label => label.textContent)
            if (labels.findIndex(label => label.includes(filter)) >= 0) {
                filterMatch++;
            }
        });
        if (filterMatch === filters.length) {
            question.style.display = 'block'
        } else {
            question.style.display = 'none'
        }
    });
}

const upvoteButtons = document.querySelectorAll('.upvote')
const downVoteButtons = document.querySelectorAll('.downvote')

upvoteButtons.forEach(btn => {
    btn.addEventListener('click', async (event) => {
        const buttonContent = event.target.textContent.split(' ')
        const newFullAmount = 1 + parseInt(buttonContent[buttonContent.length - 1])
        btn.textContent = 'Upvote ' + newFullAmount
        const response = await fetch(
            `/myQuestions/vote/${event.target.parentNode.parentNode.dataset.id}`,
            {
                method: "PUT",
                mode: 'cors',
                headers: { // kaj se poslje
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    amount: 1,
                    fullAmount: newFullAmount
                })
            }
        );
    })
})

downVoteButtons.forEach(btn => {
    btn.addEventListener('click', async (event) => {
        const buttonContent = event.target.textContent.split(' ')
        const newFullAmount = 1 + parseInt(buttonContent[buttonContent.length - 1])
        btn.textContent = 'Down-vote ' + newFullAmount
        const response = await fetch(
            `/myQuestions/vote/${event.target.parentNode.parentNode.dataset.id}`,
            {
                method: "PUT",
                mode: 'cors',
                headers: { // kaj se poslje
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    amount: -1,
                    fullAmount: newFullAmount
                })
            }
        );
    })
})