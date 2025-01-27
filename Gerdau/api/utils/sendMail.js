const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "gerdaumailer@gmail.com",
    pass: "gerdau2021",
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      partialsDir: "./utils/template/",
      defaultLayout: "",
    },
    viewPath: "./utils/template/",
    extName: ".hbs",
  })
);

const send = (mail) => {
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      return console.log("Error occurs", err);
    }
    return console.log("Email sent!!!");
  });
};

export function reportError({ to, reporter, body }) {
  const subject = `Error Reportado por ${reporter}`;
  const mailOptions = {
    to,
    subject,
    template: "errorTemplate",
    context: {
      subject,
      body,
      date: new Date(),
    },
  };

  send(mailOptions);
}

export function sendMail(data) {
  let mailOptions = {
    to: data.email,
    subject: "Nueva " + data.reason,
    template: "templateNew",
    context: {
      reason: data.reason,
      userName: data.username,
      url: data.url,
    },
  };

  send(mailOptions);
}

export function sendMailStatus(data) {
  let mailOptions = {
    to: data.email,
    subject: "Cambio de estado en " + data.reason,
    template: "templateStatus",
    context: {
      reason: data.reason,
      resolution: data.resolution,
      name: data.name,
      userName: data.userName,
      url: data.url,
      is_rejected: data.resolution === "Rechazada",
      reject_reason: data.reject_reason,
    },
  };

  send(mailOptions);
}

export function sendMailReOpen(data) {
  let mailOptions = {
    to: data.email,
    subject: "Cambio en " + data.reason,
    template: "templateReOpen",
    context: {
      reason: data.reason,
      resolution: data.resolution,
      userName: data.username,
      url: data.url,
    },
  };

  send(mailOptions);
}

export function sendMailCron(data) {
  let mailOptions = {
    to: data.email,
    subject: "Aviso en " + data.reason,
    template: "templateCron",
    context: {
      reason: data.reason,
      status: data.status,
      userName: data.userName,
      url: data.url,
    },
  };

  send(mailOptions);
}

export function sendForgotPasswordEmail({ email, userName, url }) {
  let mailOptions = {
    to: email,
    subject: "Recuperación de Contraseña",
    template: "templateForgotPassword",
    context: {
      userName,
      url,
    },
  };

  send(mailOptions);
}

export function sendRegisterEmail({ email, userName, url }) {
  let mailOptions = {
    to: email,
    subject: "Historial Clínico de Máquinas - Registro",
    template: "templateRegister",
    context: {
      userName,
      url,
    },
  };

  send(mailOptions);
}
