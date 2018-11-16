function login() {
    connect("/api/login", {
        type: "employee",
        id: $("#id").val(),
        password: $("#password").val()
    }, res => {
        console.log(res.message);
    })
}
