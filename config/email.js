var nodemailer = require('nodemailer');



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'programming12AcAdemy@gmail.com',
    pass: 'rsto grxc ojmt msdn'
  }
});

module.exports.sendMail =async (emailsubject,reciever,emailtext,emailhtml) =>{
    var mailOptions = {
        from: 'programming12AcAdemy@gmail.com',
        to: reciever,
        subject: emailsubject,
        text:emailtext,
        html: emailhtml
      };
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          throw Error(error)
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
} 

