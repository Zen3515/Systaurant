function load() {
    axios
        .post('/api/status')
        .then(res => {
            const stat = res.data;

            $("#index").attr("href", "/").text('Systaurant');
            $("#menu").attr("href", "/menu").text('Menu');

            if (!stat.employee && !stat.manager) {
                if (stat.table) {
                    $("#seat").attr("href", "/logout/table").text("Remove table");
                } else {
                    $("#seat").attr("href", "/login/table").text("Choose table");
                }
            } else {
                $("#seat").addClass('d-none');
            }

            if (stat.employee || stat.member) {
                $("#login").attr("href", "/logout").text("Logout");
            } else {
                $("#login").attr("href", "/login").text("Login");
            }

            if (stat.table) {
                $("#order").attr("href", "/order").text('Order');
            } else {
                $("#order").addClass('d-none');
            }
            
            if (stat.table) {
                $("#receipt").text('Receipt');
                if (stat.receipt) {
                    $("#receipt").attr("href", "/receipt");
                } else {
                    $("#receipt").addClass('disabled');
                }
            } else {
                $("#receipt").addClass('d-none');
            }
                

            if (stat.member) {
                $("#reserve").attr("href", "/reserve").text('Reserve');
            } else {
                $("#reserve").addClass('d-none');
            }

            if (stat.employee) {
                $("#cooking").attr("href", "/order/cooklist").text('Cooking List');
                $("#waiting").attr("href", "/order/waitlist").text('Waiting List');
            } else {
                $("#cooking").addClass('d-none');
                $("#waiting").addClass('d-none');
            }

            if (stat.manager) {
                $("#admin").attr("href", "/admin").text('Admin');
            } else {
                $("#admin").addClass('d-none');
            }

            console.log(stat);
        }).catch(res => {
            console.log(res);
        });
}

$(document).ready(load);