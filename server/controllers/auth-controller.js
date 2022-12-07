const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

// 
getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        console.log("getting logged in:", JSON.stringify(userId));
        if (!userId) {
            return res.status(200).json({
                error: false,
                loggedIn: false,
                user: {
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                }
            });
            // return res.status(200).json({
            //     success: false,
            //     loggedIn: false,
            //     user: null,
            //     errorMessage: "?"
            // })
        }
        const loggedInUser = await User.findOne({ _id: userId });
        console.log("loggedInUser: " + loggedInUser);

        if (!loggedInUser) {
            return res.status(200).json({
                error: false,
                loggedIn: false,
                user: {
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                }
            });
        }

        return res.status(200).json({
            error: false,
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                username: loggedInUser.username,
                email: loggedInUser.email,
            }
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            errorMsg: "unknown error while getting loggedIn state"
        });
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ error: true, errorMsg: "Please enter all required fields;" });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    error: true,
                    errorMsg: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    error: true,
                    errorMsg: "Wrong email or password provided."
                });
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            error: false,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                username: existingUser.username,
                email: existingUser.email,
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            errorMsg: "Unknown err while logging in"
        })
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).json({error: false});
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        console.log("create user: " + firstName + " " + lastName + " " + username + " " + email + " " + password);
        if (!firstName || !lastName || !username || !email || !password) {
            return res
                .status(400)
                .json({ error: true, errorMsg: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    error: true,
                    errorMsg: "Please enter a password with least 8 characters."
                });
        }
        console.log("password long enough");
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    error: true,
                    errorMsg: "An account with this email address already exists."
                });
        }

        const existingUserWithUsername = await User.findOne({ username: username });
        if (existingUserWithUsername) {
            return res
                .status(400)
                .json({
                    error: true,
                    errorMsg: "An account with this username already exists."
                });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = new User({
            firstName, lastName, username, email, passwordHash
        });
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        // // LOGIN THE USER
        // const token = auth.signToken(savedUser._id);
        // console.log("token:" + token);

        // await res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none"
        // }).status(200).json({
        //     error: false,
        //     user: {
        //         firstName: savedUser.firstName,
        //         lastName: savedUser.lastName,
        //         username: savedUser.username, 
        //         email: savedUser.email              
        //     }
        // })

        // console.log("token sent");

        return res.status(200).json({
            error: false
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: true,
            errorMsg: "unknown error while registering"
        });
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}