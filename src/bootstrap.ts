import { socket } from "./socket";

// grecaptcha.ready(function () {
//   grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "submit" }).then((token: string) => {
//     socket.emit("init", { token });
//   });
// });

interface Window {
  onSubmit?: (token: string) => void;
}

(window as unknown as Window).onSubmit = function (token: string) {
  console.log({ token });
  socket.emit("init", { token });
};
