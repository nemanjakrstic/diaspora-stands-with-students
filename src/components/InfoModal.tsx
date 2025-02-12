import { Alert, Modal } from "@mantine/core";
import { Message } from "../i18n";
import { useStore } from "../store";
import { useLocale } from "../stores/locale";

export const InfoModal = () => {
  const t = useLocale((state) => state.messages);
  const showInfoModal = useStore((state) => state.showInfoModal);

  return (
    <Modal opened={showInfoModal} onClose={() => useStore.setState({ showInfoModal: false })} title={`${t.title}!`}>
      <p>
        <Message tpl={t.made_with_love_message}>
          {{
            neca: () => (
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/nemanjakrstic">
                @nemanjakrstic
              </a>
            ),

            joca: () => (
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/jocascript">
                @jocascript
              </a>
            ),
          }}
        </Message>
      </p>

      <p>{t.add_to_map_instructions}</p>

      <ul>
        <li>#DijasporaUzStudente</li>
        <li>#DiasporaWithStudents</li>
        <li>#DiasporaStandsWithStudents</li>
      </ul>

      <hr />

      <p>
        <small>
          <Message tpl={t.open_source_invitation}>
            {{
              GitHub: () => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/nemanjakrstic/diaspora-stands-with-students"
                >
                  GitHub
                </a>
              ),
            }}
          </Message>
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
