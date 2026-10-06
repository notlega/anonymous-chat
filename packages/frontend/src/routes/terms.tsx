import { LegalLayout, LegalSection } from "@/components/legal";

const toc = [
  { id: "acceptance", label: "Acceptance of these terms" },
  { id: "eligibility", label: "Who can use the service" },
  { id: "service", label: "What the service is" },
  { id: "use", label: "Acceptable use" },
  { id: "content", label: "Your content" },
  { id: "availability", label: "Service availability" },
  { id: "liability", label: "Disclaimers and liability" },
  { id: "changes", label: "Changes to these terms" },
  { id: "contact", label: "Contact" },
];

export function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      intro="Plain summary: the chat is provided as-is for anyone 13 or older, you use it responsibly and at your own risk, and you keep ownership of what you post. The full details below govern your use."
      toc={toc}
    >
      <LegalSection id="acceptance" title="Acceptance of these terms">
        <p>
          By opening or using the chat service (the “Service”), you agree to
          these Terms of Service. If you do not agree, do not use the Service.
        </p>
      </LegalSection>
      <LegalSection id="eligibility" title="Who can use the service">
        <p>
          You must be at least 13 years old to use the Service. If you are under
          the age of majority where you live, you also need permission from a
          parent or guardian. By using the Service you confirm that you meet
          these requirements.
        </p>
      </LegalSection>
      <LegalSection id="service" title="What the service is">
        <p>
          The Service is an anonymous realtime chat. There are no accounts,
          usernames, or passwords — each visit receives a random session
          identifier. Because conversations are anonymous, do not share
          information that could identify you or others, such as full names,
          addresses, phone numbers, or credentials.
        </p>
      </LegalSection>
      <LegalSection id="use" title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5">
          <li>
            harass, threaten, or harm other people, or post hateful or sexually
            abusive material;
          </li>
          <li>share content that is illegal in your jurisdiction;</li>
          <li>impersonate others or mislead people about who you are;</li>
          <li>spam, advertise, or broadcast the same content repeatedly;</li>
          <li>
            interfere with the Service, including scraping, overloading, or
            attempting unauthorized access;
          </li>
          <li>use automated accounts (bots) without written permission.</li>
        </ul>
        <p>
          We may suspend or block access when we reasonably believe these rules
          have been broken.
        </p>
      </LegalSection>
      <LegalSection id="content" title="Your content">
        <p>
          You keep ownership of the messages you send. You grant the Service
          only the permission needed to store and deliver those messages to the
          people in the conversation. You are responsible for what you post —
          the Service does not endorse user content.
        </p>
      </LegalSection>
      <LegalSection id="availability" title="Service availability">
        <p>
          The Service may be changed, suspended, or discontinued at any time,
          with or without notice, including for maintenance, security, or
          operational reasons. Conversations may be lost if data is removed.
        </p>
      </LegalSection>
      <LegalSection id="liability" title="Disclaimers and liability">
        <p>
          The Service is provided “as is” and “as available”, without warranties
          of any kind, whether express or implied, including fitness for a
          particular purpose and non-infringement. We do not promise the Service
          will be uninterrupted, secure, or error-free.
        </p>
        <p>
          To the maximum extent permitted by law, we are not liable for
          indirect, incidental, or consequential damages, and our total
          liability for any claim about the Service is limited to the amount you
          paid us in the last twelve months, or zero if you pay nothing. Nothing
          in these terms limits liability that cannot be limited by law.
        </p>
      </LegalSection>
      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these terms from time to time. The date at the top of
          this page shows when they last changed. Continuing to use the Service
          after a change means you accept the updated terms.
        </p>
      </LegalSection>
      <LegalSection id="contact" title="Contact">
        <p>
          Questions about these terms? Email{" "}
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

export default Terms;
