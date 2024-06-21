import { createError } from "./error";


export const verifyToken  = (req, res, next) => {
    const token = req.cockies.access_token;
    if(!token){
        return next(createError(401, "t'es connecté"))
    }

    jwt.verify(token, process.env.JW, (err, user) =>{
        if (err) return next(createError(403, "le token est invalid"));
        req.user = user;
        next();
    })
}


export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else {
            return next(createError(403, "tu n'as pas le droit"))
        }
    })
}


export const verifyadmin = (req, res, next ) => {
    verifyToken(req, res, next,  () => {
        if(req.user.isadmin){
            next()
        } else {
            return next(createError(403, "tu n'as pas le droit" ))
        }
            
    })
}