import { socket } from "./socket";

socket.on("connect", () => {
  grecaptcha.ready(function () {
    grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "submit" }).then((token: string) => {
      // console.log("Setting up reCAPTCHA...");
      socket.emit("init", { token });
    });
  });
});
