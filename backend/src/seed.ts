import { AppService } from "./app.service.js";
import { destroyDb, tryEnsureSchema } from "./db.js";

const service = new AppService();
console.log(await tryEnsureSchema());
console.log(await service.seedDatabase());
await destroyDb();
