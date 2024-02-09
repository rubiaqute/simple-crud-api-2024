import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { server } from './server'

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Your port is ${PORT}`));