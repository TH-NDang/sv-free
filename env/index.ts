// This file ensures we export both client and server env
// We don't use dynamic imports to avoid GENSYNC errors

import { env as clientEnv } from "./client";
import { env as serverEnv } from "./server";

export { clientEnv, serverEnv };
