const createAnswerBtnList = document.querySelectorAll("#create-answer-btn")
const deleteAnswersButtons = document.querySelectorAll('.delete-answer')
const selectAnswersButtons = document.querySelectorAll('.select-answer')

createAnswerBtnList.forEach(createAnswerBtn => {
    createAnswerBtn.addEventListener('click', async (event) => {
        const id = event.target.dataset.id
        const answerText = event.target.parentNode.parentNode.querySelector('#description').value;
        const response = await fetch(
            `/api/create/answer/${id}`,
            {
                method: "POST",
                mode: 'cors',
                headers: { // kaj se poslje
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    text: answerText
                })
            }
        )
        if (response.status === 201) {
            const answerJson = (await response.json()).answer;
            const answerList = event.target.parentNode.parentNode.querySelector('.answer-list')
            answerList.insertBefore(createAnswerCard(answerJson), answerList.firstChild)
        } else if (response.status === 401) {
            alert('You have to be logged in nto answer this question')
        }
    })
})

function createAnswerCard(answer) {
    const answersCardContainer = document.createElement('div');
    answersCardContainer.dataset.id = answer._id
    answersCardContainer.dataset.uid = answer.user._id
    answersCardContainer.className = "card shadow-sm m-2 just_answers_card";


    const date = new Date(answer.createdAt);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(/\//g, ".");

    const answersHeader = document.createElement('div');
    answersHeader.className = 'card-header';
    answersHeader.style.display = "flex";
    answersHeader.textContent = answer.user.username + ", " + formattedDate;

    const desc = document.createElement('div');
    desc.className = 'card-body';
    desc.textContent = answer.text;

    const delButton = document.createElement('button')
    delButton.textContent = 'Delete'
    delButton.className = 'btn btn-danger'
    delButton.addEventListener('click', async event => await deleteAnswerInList(event, answer._id))

    answersCardContainer.appendChild(answersHeader);
    answersCardContainer.appendChild(desc);
    answersCardContainer.appendChild(delButton)


    return answersCardContainer;
}

deleteAnswersButtons.forEach(deleteAnswerButton => {
    deleteAnswerButton.addEventListener('click', event => deleteAnswer(event))
});

selectAnswersButtons.forEach(selectButton => {
    selectButton.addEventListener('click', event => onSelectButton(event))
});

async function deleteAnswer(event) {
    const id = event.target.dataset.id;
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

async function onSelectButton(event) {
    const id = event.target.dataset.id;
    const approved = (event.target.dataset.approved == 'true');
    const response = await fetch(
        `/myQuestions/deleteAnswer/${id}`,
        {
            method: "PUT",
            mode: 'cors',
            headers: { // kaj se poslje
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                approved: !approved
            })
        }
    );
    event.target.dataset.approved = !approved
    event.target.textContent = !approved === true ? 'Deselect answer' : 'Select answer'
    event.target.parentNode.style.border = !approved === true ? '2px solid #b2760a' : 'none'
}