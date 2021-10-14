const express = require('express')
const app = express();
var mysql      = require('mysql');
const port = process.env.PORT || 8000;
const logger = require('morgan')
const bcryptjs = require('bcryptjs');
// const twofa = require('./speakeasy.js')
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
var nodemailer = require('nodemailer');
const {providerEmail} = require('./keys.js')
const {providerPassword} = require('./keys.js')

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: providerEmail,
    pass: providerPassword
  }
});

app.use(logger('dev'))
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

//   console.log(twofa.generateSecret())

const connectDatabase = () => {
        var connection = mysql.createConnection({
            host     : '107.6.184.197',
            user     : 'lalalunaco_visa',
            password : '9nsh3n5XYd',
            database : 'lalalunaco_visa'
            });

            connection.connect(function(err) {
                if (err) {
                    console.log('error when connecting to db:', err);
                    setTimeout(connectDatabase, 10000); 
                }

                console.log("Connected!");
            });

            // You have successfully created a new database. The details are below.

            // Username: jBV0LGcTpm

            // Database name: jBV0LGcTpm

            // Password: dn67W9iDqy

            // Server: remotemysql.com

            // Port: 3306

            // connection.query("INSERT INTO `user`(`name`, `username`, `email`, `password`, `active`) VALUES ('Hama Javed','username','email@gmail.com','password','true');")

            connection.query("CREATE TABLE  IF NOT EXISTS `issuer` (`id` INTEGER NOT NULL AUTO_INCREMENT ,`name` VARCHAR(255) ,`username` VARCHAR(255) ,`email` VARCHAR(255) ,`password` VARCHAR(255) ,`active` VARCHAR(255), `image` VARCHAR(255), PRIMARY KEY `id`(`id`)) ENGINE = INNODB DEFAULT CHARSET = utf8;");
            connection.query("CREATE TABLE  IF NOT EXISTS `user` (`id` INTEGER NOT NULL AUTO_INCREMENT, `email` VARCHAR(255) ,`password` VARCHAR(255) , PRIMARY KEY `id`(`id`)) ENGINE = INNODB DEFAULT CHARSET = utf8;");
            // connection.query("CREATE DATABASE [IF NOT EXISTS] visa;")

            app.post('/api/banks/all',(req,res) => {
                const limit = req.body.limit;
                const offset = req.body.offset;
                // console.log(`SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`)
                connection.query(`SELECT * FROM issuer LIMIT ${limit} OFFSET ${offset}`, (err,result) => {
                    if (err) console.log(err);
                    connection.query(`SELECT * FROM issuer`, (err,allItems) => {
                        if (err) console.log(err);
                        if (allItems.length != undefined) {
                            res.json({
                                "success": true,
                                "message": result,
                                "totalPages": allItems.length / limit,
                                "totalItems": allItems.length
                            });
                        }else {
                            res.json({
                                "success": true,
                                "message": result,
                                "totalPages": limit,
                                "totalItems": allItems.length
                            });
                        }
                    })
                })
            })

            app.post('/api/banks', (req,res) => {
                if (!req.body.email) {
                    res.json({"info": true, "message": "Email Field is required"});
                }else if (!req.body.password) {
                    res.json({"info": true, "message": "Password Field is required"})
                }else if (!req.body.username) {
                    res.json({"info": true, "message": "Username Field is required"});
                }else if (!req.body.name) {
                    res.json({"info": true, "message": "Name Field is required"});
                }else if (!req.body.image) {
                    res.json({"info": true, "message": "Image Field is Required"});
                }else if (!req.body.active) {
                    res.json({"info": true, "message": "Active Field is Required"});
                }else {
                    var hash = bcryptjs.hashSync(req.body.password, 8);
                    console.log(hash);
                    req.body.password = hash;
                    connection.query("INSERT INTO `issuer`(`name`, `username`, `email`,`image`, `password`, `active`) VALUES ('"+req.body.name+"','"+req.body.username+"','"+req.body.email+"','"+req.body.image+"','"+req.body.password+"','"+req.body.active+"');", (err, result) => {
                        if (err) {console.log(err)}
                        if (result.affectedRows > 0) {
                            res.json({"info": true, "message": "Bank Create Successfull"})
                        }else {
                            res.json({"error": true, "message": "Some Went Wrong. Please Try Again."});
                        }
                    })
                }
            });

            app.post('/api/banks/edit', (req,res) => {
                if (!req.body.email) {
                    res.json({"info": true, "message": "Email Field is required"});
                }else if (!req.body.id) {
                    res.json({"info": true, "message": "Id is Required"})
                }else if (!req.body.password) {
                    res.json({"info": true, "message": "Password Field is required"})
                }else if (!req.body.username) {
                    res.json({"info": true, "message": "Username Field is required"});
                }else if (!req.body.name) {
                    res.json({"info": true, "message": "Name Field is required"});
                }else if (!req.body.image) {
                    res.json({"info": true, "message": "Image Field is Required"});
                }else if (!req.body.active) {
                    res.json({"info": true, "message": "Active Field is Required"});
                }else {
                    var hash = bcryptjs.hashSync(req.body.password, 8);
                    req.body.password = hash;
                    // connection.query("INSERT INTO `issuer`(`name`, `username`, `email`,`image`, `password`, `active`) VALUES ('"+req.body.name+"','"+req.body.username+"','"+req.body.email+"','"+req.body.image+"','"+req.body.password+"','"+req.body.active+"');", (err, result) => {
                    connection.query("UPDATE issuer SET email='"+ req.body.email +"', password='"+req.body.password+"', username='"+ req.body.username +"', name='"+req.body.name+"', image='"+req.body.image+"', active='"+req.body.active+"'  WHERE id ='"+ req.body.id +"';", (err, result) => {
                        if (err) {console.log(err)}
                        if (result.affectedRows > 0) {
                            res.json({"success": true, "message": "Bank Updated Successfull"})
                        }else {
                            res.json({"error": true, "message": "Some Went Wrong. Please Try Again."});
                        }
                    })
                }
            });

            app.delete('/api/banks', (req,res) => {
                if (!req.body.id) {
                    res.json({"info": true, "message": "id is Required"})
                }else {
                    connection.query("DELETE FROM `issuer` WHERE id='"+req.body.id+"'", (err, result) => {
                        if (err) console.log(result);
                        if (result != null) {
                            res.json({"success": true, "message": "Bank Deleted Successful"})
                        }else {
                            res.json({"info": true, "message": "Unable to Delete Bank!"})
                        }
                    });
                }
            })




            app.post('/api/users/all',(req,res) => {
                const limit = req.body.limit;
                const offset = req.body.offset;
                connection.query(`SELECT * FROM user`, (err,result) => {
                    if (err) console.log(err);
                    res.json({
                        "success": true,
                        "message": result
                    })
                })
                // console.log(`SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`)
                // connection.query(`SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`, (err,result) => {
                //     if (err) console.log(err);
                //     connection.query(`SELECT * FROM user`, (err,allItems) => {
                //         if (err) console.log(err);
                //         if (allItems.length != undefined) {
                //             res.json({
                //                 "success": true,
                //                 "message": result,
                //                 "totalPages": allItems.length / limit,
                //             });
                //         }else {
                //             res.json({
                //                 "success": true,
                //                 "message": result,
                //                 "totalPages": limit
                //             });
                //         }
                //         console.log(allItems.length / limit);
                //     })
                // })
            })

            app.post('/api/auth/login',(req,res) => {
                if (!req.body.email) {
                    res.json({"info": true, "message": "Email is required!"});
                }else if (!req.body.password) {
                    res.json({"info": true, "message": "Password is required!"})
                }else {
                    connection.query(`SELECT * FROM user WHERE email='${req.body.email}' LIMIT 1`, (err,result) => {
                        if (err) console.log(err);
                        if (result.length > 0) {
                            const isPasswordMatch = bcryptjs.compareSync(req.body.password, result[0].password);
                            if (isPasswordMatch) {
                                var secret = speakeasy.generateSecret({
                                    name: "Visa Issuer Admin"
                                })
                                
                                qrcode.toDataURL(secret.otpauth_url, function(err, data) {
                                    secret.data = data;
                                    res.json({"success": true, "message": result, "secret": secret});
                                })
                            }else {
                                res.json({"info": true, "message": "Invalid Email or Password!"});
                            }
                        }else {
                            res.json({"info": true, "message": "Invalid Email or Password!"});
                        }
                    })
                }
            })

            app.post('/api/twoFA/verify', (req,res) => {
                if (!req.body.secret) res.json({"info": true, "message": "Secret is Required!"})
                else if (!req.body.encoding) res.json({"info": true, "message": "Encoding is Required!"})
                else if (!req.body.token) res.json({"info": true, "message": "Token is Required!"})
                else{
                    const verify = speakeasy.totp.verify({
                        secret: req.body.secret,
                        encoding: req.body.encoding,
                        token: req.body.token
                    })
                    if (verify) {
                        res.json({"success": true, "message": "Verify Successful!"})
                    }else {
                        res.json({"info": true, "message": "Invalid Token!"})
                    }
                }
            })

            app.post('/api/users', (req,res) => {
                if (!req.body.email) {
                    res.json({"info": true, "message": "Email Field is required!"});
                }else if (!req.body.password) {
                    res.json({"info": true, "message": "Password Field is required!"})
                }else {
                    var hash = bcryptjs.hashSync(req.body.password, 8);
                    connection.query("INSERT INTO `user` (`email`,`password`) VALUES ('"+req.body.email+"','"+hash+"');", (err, result) => {
                        if (err) {console.log(err)}
                        var mailOptions = {
                            from: providerEmail,
                            to: req.body.email,
                            subject: "Visa Issuer Admin Login Credentials",
                            text: `This is Your Login Credentials for Visa Issuer Admin Pnael. \n E-Mail: ${req.body.email} \n Password: ${req.body.password}`
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            console.log(info);
                        if (error) {
                            console.log(error.response);
                            console.log(error);
                            res.json({"error": true, "message": "There was an error to send email. I am Sorry for that Please Try Again Later."});
                        } else {
                            if (result.affectedRows > 0) {
                                res.json({"success": true, "message": "User Create Successfull!"})
                            }else {
                                res.json({"error": true, "message": "There was an error to Create User. I am Sorry for that Please Try Again Later."});
                            }
                        }
                        });
                    })
                }
            });

            app.post('/api/users/edit', (req,res) => {
                if (!req.body.email) {
                    res.json({"info": true, "message": "Email Field is required!"});
                }else if (!req.body.password) {
                    res.json({"info": true, "message": "Password Field is required!"})
                }else if (!req.body.id) {
                    res.json({"info": true, "message": "Id is Required for update!"})
                }else {
                    var hash = bcryptjs.hashSync(req.body.password, 8);
                    console.log(hash);
                    req.body.password = hash;
                    connection.query("UPDATE user SET email='"+req.body.email+"', password='"+req.body.password+"' WHERE id='"+req.body.id+"'  ", (err, result) => {
                        if (err) {console.log(err)}
                        if (result.affectedRows > 0) {
                            res.json({"success": true, "message": "User Updated Successfull"})
                        }else {
                            res.json({"error": true, "message": "Some Went Wrong. Please Try Again."});
                        }
                    })
                }
            });

            app.delete('/api/users', (req,res) => {
                if (!req.body.id) {
                    res.json({"info": true, "message": "id is Required"})
                }else {
                    connection.query("DELETE FROM `user` WHERE id='"+req.body.id+"'", (err, result) => {
                        if (err) console.log(result);
                        if (result != null) {
                            res.json({"success": true, "message": "User Deleted Successful"})
                        }else {
                            res.json({"info": true, "message": "Unable to Delete User!"})
                        }
                    });
                }
            })

            connection.on("error", (err) => {
                console.log(err);
                connectDatabase();
            })

            process.on('uncaughtException', err => {
                console.log(err);
                connectDatabase();
            })

}

connectDatabase();

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("server started")
})

