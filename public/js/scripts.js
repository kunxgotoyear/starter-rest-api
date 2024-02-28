const myModalEl = document.getElementById("modalAlert")
const modal = new mdb.Modal(myModalEl, {backdrop: "static", keyboard: false, focus: true})
modal.show()
const instance = mdb.Toast.getInstance(document.getElementById("placement-example-toast"))

;(this.Notif = (instance) => {
  return {
    update: () => {
      instance.update({
        stacking: true,

        hidden: true,
        width: "375px",
        position: "top-right",
        autohide: true,
        delay: 3000,
      })
    },
    show: ({...arg}) => {
      !arg.status ? instance.update({color: "danger"}) : instance.update({color: "light"})
      document.getElementById("placement-example-toast").children[1].textContent = arg.content
      instance.show()
    },
    hide: () => {
      instance.hide()
    },
  }
})(instance).update()

$(document).ready(async function () {
  $.ajax({
    type: "POST",
    url: "/auth/status?Content-Type=application/json&Charset=UTF-8",
    dataType: "json",
    success: function (response) {
      console.log(response)
      modal.hide()
    },
    error: function (result) {
      console.log(result)
      const response = result.responseJSON
      if (response.status === false && response.content.toLowerCase().includes("register")) {
        switch (location.pathname) {
          case "/login.html":
            modal.hide()
            break
          case "/register.html":
            modal.hide()
            break
          default:
            location.href = "/login.html"
            modal.hide()
            break
        }
      } else if (response.status === false) {
        const path = ["/login", "/register", "/index", "/"]
        switch (location.pathname.replace(".html", "")) {
          case "/login":
            window.location.replace("main.html")
            modal.hide()
            break
          case "/register":
            window.location.replace("main.html")
            modal.hide()
            break
          case "/index":
            window.location.replace("main.html")
            modal.hide()
            break
          case "/":
            window.location.replace("main.html")
            modal.hide()
            break
          default:
            modal.hide()
            break
        }
      }
    },
  })
  $("[data-form-forgot]").submit((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    modal.show()

    $.ajax({
      type: "POST",
      url: "/auth/login?Content-Type=application/json&Charset=UTF-8",
      data,
      dataType: "json",
      success: function (response) {
        modal.hide()
        Notif(instance).show(response)
        window.location.replace("main.html")
      },
      error: function (result) {
        modal.hide()
        Notif(instance).show(result.responseJSON)
      },
    })
  })
  $("[data-form-login]").submit((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    modal.show()

    $.ajax({
      type: "POST",
      url: "/auth/login?Content-Type=application/json&Charset=UTF-8",
      data,
      dataType: "json",
      success: function (response) {
        modal.hide()
        Notif(instance).show(response)
        window.location.replace("main.html")
      },
      error: function (result) {
        modal.hide()
        Notif(instance).show(result.responseJSON)
      },
    })
  })
  $("[data-form-register]").submit((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    modal.show()
    $.ajax({
      type: "POST",
      url: "/auth/register?Content-Type=application/json&Charset=UTF-8",
      data,
      dataType: "json",
      success: function (response) {
        console.log(response)
        modal.hide()
        Notif(instance).show(response)
        window.location.replace("login.html")
      },
      error: function (result) {
        console.log(result)
        modal.hide()
        Notif(instance).show(result.responseJSON)
      },
    })
  })
  $("[data-button-logout]").click((e) => {
    e.preventDefault()
    $.ajax({
      type: "PUT",
      url: "/auth/logout?Content-Type=application/json&Charset=UTF-8",
      dataType: "json",
      success: function (response) {
        modal.hide()
        Notif(instance).show(response)
        window.location.replace("login.html")
      },
      error: function (result) {
        modal.hide()
        Notif(instance).show(result.responseJSON)
      },
    })
  })
})
