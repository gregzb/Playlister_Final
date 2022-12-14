const jwt = require("jsonwebtoken")

function authManager() {
    verify = (req, res, next) => {
        // console.log("req: " + req);
        // console.log("next: " + next);
        // console.log("Who called verify?");
        console.log("verify cookies: ", JSON.stringify(req.cookies));
        try {
            const token = req.cookies.token;
            if (!token) {
                // guest
                req.userId = null;
            } else {
                const verified = jwt.verify(token, process.env.JWT_SECRET)
                console.log("verified.userId: " + verified.userId);
                req.userId = verified.userId;
            }

            next();
        } catch (err) {
            console.error("error in jwt verify maybe?");
            console.error(err);

            // we'll just make them a guest
            req.userId = null;
            next();
            // return res.status(401).json({
            //     loggedIn: false,
            //     user: null,
            //     errorMessage: "Unauthorized"
            // });
        }
    }

    verifyUser = (req) => {
        console.log("verifyUser cookies: ", JSON.stringify(req.cookies));
        try {
            const token = req.cookies.token;
            if (!token) {
                return null;
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken.userId;
        } catch (err) {
            return null;
        }
    }

    signToken = (userId) => {
        return jwt.sign({
            userId: userId
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;