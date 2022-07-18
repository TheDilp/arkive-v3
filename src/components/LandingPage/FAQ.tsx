import { Accordion, AccordionTab } from "primereact/accordion";

export default function FAQ() {
  return (
    <section className="w-6 text-white" id="faq">
      <h2 className="w-full Merriweather text-center text-3xl my-0">FAQ</h2>
      <Accordion activeIndex={0} multiple className="Lato">
        <AccordionTab header="What is an alpha?">
          <p>
            The Arkive is in it's alpha stage, meaning that the
            <a
              href="#wikiFeatures"
              className="font-bold text-blue-400 hover:text-blue-200 no-underline"
            >
              {" "}
              core features{" "}
            </a>
            have been implemented and are being tested.
          </p>
          <p></p>
        </AccordionTab>
        <AccordionTab header="Why Patreon?">
          The application is still in active development. You are s
        </AccordionTab>
        <AccordionTab header="What do I get?"></AccordionTab>
        <AccordionTab header="What is my money being spent on?">
          The primary goal is to cover the costs of data and file storage as
          well as hosting the application itself.
        </AccordionTab>

        <AccordionTab header="Is my project private?">
          Projects and your creations are private by default. They can only be
          accessed by others if you set them as public.
        </AccordionTab>
        <AccordionTab header="What about feature X?">
          <p>
            The Arkive team currently consists of one person, which means
            developing new features will take time, and it needs to be balanced
            with bug fixes and patches to existing functionality.
          </p>
          <p>
            Feel free to suggest new features in our{" "}
            <a
              href="https://discord.gg/AnbtkzrffA"
              className="font-bold no-underline"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#7289da",
              }}
            >
              {" "}
              Discord
            </a>{" "}
            if you're a member.
          </p>
          <p>
            And don't forget, if you join at the Curator tier you can vote on
            new features on Patreon and influence further development.
          </p>
        </AccordionTab>
        <AccordionTab header="What if I have more questions?">
          You can join our{" "}
          <a
            href="https://discord.gg/AnbtkzrffA"
            className="font-bold no-underline"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#7289da",
            }}
          >
            {" "}
            Discord
          </a>{" "}
          and ask in the non-members area. You don't need to be a patron to
          join!
        </AccordionTab>
      </Accordion>
    </section>
  );
}
