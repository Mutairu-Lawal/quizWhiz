"use strict";
function getCurrentUserData() {
    const user = localStorage.getItem('userObject');
    return user
        ? JSON.parse(user)
        : {
            name: '',
            Question: [...questions],
            correct: [],
            incorrect: [],
            unanswered: [],
            grade: '',
            Comment: '',
            time: '',
            ['new-subject']: subject,
        };
}
