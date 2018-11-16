function connect(url, data, success, error = err => { console.log(err.responseJSON); }) {
    $.ajax({
        type: "POST",
        contentType: "application/json" ,
        processData: false,
        url: url,
        data: JSON.stringify(data),
        success: success,
        error: error
    });
}