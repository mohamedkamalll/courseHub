var nodemailer = require('nodemailer');



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'programming12AcAdemy@gmail.com',
    pass: 'rsto grxc ojmt msdn'
  }
});

module.exports.sendMail =async (emailsubject,emailtext) =>{
    var mailOptions = {
        from: 'programming12AcAdemy@gmail.com',
        to: 'ana1moka@gmail.com',
        subject: emailsubject,
        html: emailtext
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

