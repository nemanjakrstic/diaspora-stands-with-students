import { Alert, Divider, Modal, Text } from "@mantine/core";
import { useStore } from "../store";

export const InfoModal = () => {
  const t = useStore((state) => state.messages);
  const showInfoModal = useStore((state) => state.showInfoModal);

  return (
    <Modal opened={showInfoModal} onClose={() => useStore.setState({ showInfoModal: false })} title={`${t.title}!`}>
      <p>
        Napravljeno s ljubavlju od{" "}
        <a target="_blank" href="https://github.com/nemanjakrstic">
          @nemanjakrstic
        </a>{" "}
        i{" "}
        <a target="_blank" href="https://github.com/jocascript">
          @jocascript
        </a>
        . Volimo vas studenti! Borimo se sa vama do kraja!
      </p>
      <p>Za dodavanje na mapu, samo objavite post na Instagramu i dodajte bilo koji od sledećih tagova:</p>
      <ul>
        <li>#DijasporaUzStudente</li>
        <li>#DiasporaWithStudents</li>
        <li>#DiasporaStandsWithStudents</li>
      </ul>
      <hr />
      <p>
        <small>
          Ovaj projekat je open-source. Znas da programiraš? Pošalji nam PR na{" "}
          <a target="_blank" href="https://github.com/nemanjakrstic/diaspora-stands-with-students">
            GitHub
          </a>
          -u. Jedva čekamo da nam se pridružiš!
        </small>
      </p>

      <Alert variant="light" color="blue">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </Alert>
    </Modal>
  );
};
