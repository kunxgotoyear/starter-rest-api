const myModalEl = document.getElementById('modalAlert')
const modal = new mdb.Modal(myModalEl, { backdrop: "static", keyboard: false, focus: true })
modal.show()
const instance = mdb.Toast.getInstance(document.getElementById('placement-example-toast'));

(this.Notif = (instance) => {
    return {
        update: () => {
            instance.update({
                stacking: true,
                hidden: true,
                width: '375px',
                position: 'top-right',
                autohide: true,
                delay: 3000,
            });

        },
        show: ({ ...arg }) => {
            console.log(document.getElementById('placement-example-toast'));
            !arg.status ? instance.update({ color: "danger" }) : instance.update({ color: "light" })
            document.getElementById('placement-example-toast').children[1].textContent = arg.content
            instance.show()
        },
        hide: () => {
            instance.hide()
        }
    }
})(instance).update()


$(document).ready(async function () {

    $.ajax({
        type: "GET",
        url: "/auth/status?Content-Type=application/json&Charset=UTF-8",
        dataType: "json",
        success: function (response) {
            console.log("Success!", response);
            modal.hide()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            const response = jqXHR.responseJSON
            if (response.status === false && response.content.toLowerCase().includes("login") && response.content.toLowerCase().includes("register")) {
                switch (location.pathname) {
                    case "/login.html":
                        console.log(location.pathname);
                        console.log("stay page login");
                        modal.hide()
                        break;
                    case "/register.html":
                        console.log(location.pathname);
                        console.log("stay page register");
                        modal.hide()
                        break;
                    default:
                        console.log(location.pathname);
                        console.log("goto page login");
                        location.href = "/login.html"
                        modal.hide()
                        break;
                }
            } else {
                switch (location.pathname) {
                    case "/login.html":
                        console.log(location.pathname);
                        console.log("go back");
                        window.location.replace("main.html");
                        modal.hide()
                        break;
                    case "/register.html":
                        console.log(location.pathname);
                        console.log("go back");
                        window.location.replace("main.html");
                        modal.hide()
                        break;
                    case "/index.html":
                        console.log(location.pathname);
                        console.log("go back");
                        window.location.replace("main.html");
                        modal.hide()
                        break;
                    default:
                        console.log(location.pathname);
                        console.log("stay");
                        modal.hide()
                        break;
                }
            }
        }
    });
    $("[data-form-login]").submit((e) => {
        e.preventDefault()
        console.log(e);
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        modal.show()

        $.ajax({
            type: "POST",
            url: "/auth/login?Content-Type=application/json&Charset=UTF-8",
            data,
            dataType: "json",
            success: function (response) {
                console.log("Success!", response);
                modal.hide()
                Notif(instance).show(response)
                window.location.replace("main.html");
            },
            error: function (result) {
                console.error(result.responseJSON,);
                modal.hide()
                Notif(instance).show(result.responseJSON)
            }
        });
    })
    $("[data-button-logout]").click((e) => {
        e.preventDefault()
        $.ajax({
            type: "PUT",
            url: "/auth/logout?Content-Type=application/json&Charset=UTF-8",
            dataType: "json",
            success: function (response) {
                console.log("Success!", response);
                modal.hide()
                Notif(instance).show(response)
                window.location.replace("login.html");
            },
            error: function (result) {
                console.error(result.responseJSON,);
                modal.hide()
                Notif(instance).show(result.responseJSON)
            }
        });
    })
});