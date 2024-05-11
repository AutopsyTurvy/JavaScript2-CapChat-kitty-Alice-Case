


// This should prevent the thought form from submitting 


document.getElementById('thoughtsForm').addEventListener('submit', function(event) {
    var inputField = document.getElementById('thought');
    if (inputField.value.trim() === '') {
        alert('Please enter your thought before submitting!');
        event.preventDefault(); 
    }
});