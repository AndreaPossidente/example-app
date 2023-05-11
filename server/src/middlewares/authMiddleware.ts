import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// relazionale - relazioni tra le tabelle
// non relazionale - più di un tipo, MongoDb è a documenti - non ci sono relazioni tra le tabelle anche se si possono simulare

const { SECRET = "" } = process.env

// il middleware vede se c'è l'header di autorizzazione (bearer token)
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  let { authorization } = req.headers
  const token = authorization?.split(" ")[1] // lo prende splittando la stringa con uno spazio - 0 = Bearer ja'f93'9f3hj'9fh3'f3h'fh3'fh329'fh32fh3'foeèfew - 1 = token jwt
  if (token) {
    jwt.verify(token, SECRET, (err: any, decoded: any) => { // verifica se il token è valido e coincide con il SECRET - decoded = payload del jwt
      if (err) {
        res.clearCookie("jwt") // cancella il cookie che si chiama jwt e manda ris che non sei autorizzato
        res.status(401).json({ msg: "Unauthorized" })
      } else {
        // @ts-ignore
        req.user = decoded // mette sulla req una proprietà (xché è un oggetto) che si chiama user e lo assegna al payload del jwt
        next()
      }
    })
  } else {
    res.status(401).json({ msg: "Unauthorized" })
  }
}
