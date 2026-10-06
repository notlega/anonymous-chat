import { route } from "@typeroute/router";
import { Chat } from "@/routes/chat";
import { Privacy } from "@/routes/privacy";
import { SignIn } from "@/routes/sign-in";
import { Terms } from "@/routes/terms";
import { auth } from "./middleware";

const chat = route("/").use(auth).component(Chat);
const signIn = route("/sign-in").component(SignIn);
const terms = route("/terms").component(Terms);
const privacy = route("/privacy").component(Privacy);

export const routes = { chat, signIn, terms, privacy };
