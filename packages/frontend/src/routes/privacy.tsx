import { LegalLayout, LegalSection } from "@/components/legal";

const toc = [
  { id: "overview", label: "Overview" },
  { id: "collect", label: "What we collect" },
  { id: "use", label: "How we use it" },
  { id: "not-do", label: "What we do not do" },
  { id: "share", label: "Who we share it with" },
  { id: "retain", label: "Retention" },
  { id: "security", label: "Security" },
  { id: "cookies", label: "Cookies and local storage" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="Plain summary: the chat is anonymous — no accounts, no email, no advertising trackers, no selling data. We keep only what is needed to run the chat: a session identifier, your messages, basic server logs, and your theme preference."
      toc={toc}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          This policy explains what information the chat service (the “Service”)
          handles and why. It applies to everyone who opens the Service.
        </p>
      </LegalSection>
      <LegalSection id="collect" title="What we collect">
        <p>To run the Service we process:</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Session identifier</strong> — a random id stored in your
            session, used to keep you signed in and to address messages to you.
            It is not linked to an account.
          </li>
          <li>
            <strong>Message content</strong> — the text you send, stored so it
            can be delivered to the conversation.
          </li>
          <li>
            <strong>Server logs</strong> — routine technical records such as
            request times, IP addresses, and errors, used for reliability and
            abuse prevention.
          </li>
          <li>
            <strong>Theme preference</strong> — light, dark, or system, saved in
            your browser’s local storage.
          </li>
        </ul>
      </LegalSection>
      <LegalSection id="use" title="How we use it">
        <p>
          Information is used to deliver messages in realtime, keep sessions
          working, diagnose errors, protect the Service from abuse, and comply
          with law when we are legally required to.
        </p>
      </LegalSection>
      <LegalSection id="not-do" title="What we do not do">
        <p>
          We do not create user accounts, ask for names or emails, show
          advertising, run third-party analytics, build marketing profiles, or
          sell or rent any data.
        </p>
      </LegalSection>
      <LegalSection id="share" title="Who we share it with">
        <p>
          Data is processed by the infrastructure providers that host the
          Service — the application server, database, and realtime messaging
          gateway — and by nobody else, except where disclosure is required by
          law or to protect the rights and safety of people.
        </p>
      </LegalSection>
      <LegalSection id="retain" title="Retention">
        <p>
          Messages are kept while the conversation is active and removed when
          they are no longer needed to run the chat. Routine server logs are
          kept only briefly for debugging and security, then discarded. You can
          ask us to remove your data using the contact below.
        </p>
      </LegalSection>
      <LegalSection id="security" title="Security">
        <p>
          Traffic is encrypted in transit, and we apply access controls and
          session handling appropriate to an anonymous service. No method of
          transmission or storage is completely secure, so we cannot guarantee
          absolute security.
        </p>
      </LegalSection>
      <LegalSection id="cookies" title="Cookies and local storage">
        <p>
          The Service uses the session cookie needed to stay signed in and local
          storage for your theme preference. There are no advertising or
          cross-site tracking cookies.
        </p>
      </LegalSection>
      <LegalSection id="rights" title="Your rights">
        <p>
          Depending on where you live, you may have the right to access,
          correct, or delete personal data, and to object to or restrict its
          processing. Because the Service is anonymous, the fastest way to
          remove your footprint is to stop using your current session; for
          anything else, contact us and we will help.
        </p>
      </LegalSection>
      <LegalSection id="children" title="Children">
        <p>
          The Service is not directed to children under 13, and we do not
          knowingly collect data from them. If you believe a child has provided
          data, contact us and we will remove it.
        </p>
      </LegalSection>
      <LegalSection id="changes" title="Changes">
        <p>
          We may update this policy from time to time. The date at the top shows
          when it last changed. Material changes will be announced in the
          Service where practical.
        </p>
      </LegalSection>
      <LegalSection id="contact" title="Contact">
        <p>
          Privacy questions or data requests? Email{" "}
          <a
            href="mailto:contact@example.com"
            className="underline underline-offset-4"
          >
            contact@example.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

export default Privacy;
