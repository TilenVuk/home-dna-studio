import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ReportInput = z.object({
  summary: z.string(),
  rooms: z.array(z.object({ key: z.string(), label: z.string() })),
  investmentLine: z.string(),
  executionLevel: z.string(),
});

const ReportSchema = z.object({
  intro: z.string(),
  lifestyle: z.string(),
  style: z.string(),
  why: z.string(),
  rooms: z.array(z.object({ label: z.string(), text: z.string() })),
  investment: z.string(),
  nextSteps: z.array(z.object({ title: z.string(), text: z.string() })),
  closing: z.string(),
});

export type HomeDnaReport = z.infer<typeof ReportSchema>;

const SYSTEM = [
  "Ti si izkušen notranji oblikovalec studia WOLF STUDIO in pišeš osebno pripravljeno poročilo Home DNA™ za stranko.",
  "Pišeš izključno v slovenščini, v prvi osebi množine (mi, vaša ekipa Wolf Studio).",
  "Ton: premijski, strokoven, topel, oseben in jasen.",
  "Izogibaj se marketinškim frazam, pretiranemu razkošnemu besedišču in tehničnemu mizarskemu izrazoslovju.",
  "Nikoli ne omenjaj umetne inteligence, modelov, vprašalnika, obrazca ali podatkov iz obrazca.",
  "Piši tekoče odstavke brez naštevanja s pomišljaji. Poročilo naj bo jedrnato, berljivo in navdihujoče.",
].join(" ");

export const generateHomeDnaReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ReportInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = [
      "Podatki o projektu stranke:",
      data.summary,
      "",
      `Okvirna investicija: ${data.investmentLine}`,
      `Raven izvedbe: ${data.executionLevel}`,
      "",
      "Napiši poročilo z naslednjimi deli:",
      "intro: 3–5 stavkov osebnega uvoda (za koga je projekt, celotna vizija, kaj ta dom dela poseben).",
      "lifestyle: povzetek življenjskega sloga (vsakodnevne rutine, prioritete, trenutni izzivi, prihodnje potrebe) in kako naj dom podpira njihov vsakdan. 1–2 odstavka.",
      "style: opis izbranih slogov, vzdušja in barvne smeri. Če je stranka dodala povezavo z navdihom, omeni, da jo bomo upoštevali pri oblikovanju.",
      "why: naslov razdelka je 'Zakaj bo ta dom deloval za vas'. Med 80 in 120 besedami poveži življenjski slog, gospodinjstvo, izbrani slog, trenutne izzive, prihodnje potrebe in izbrane prostore v eno osebno zgodbo ter pojasni, kako se te odločitve povezujejo v dom, ki podpira njihov vsakdan. Ne ponavljaj že napisanega iz prejšnjih razdelkov in ne naštevaj odgovorov; piši tekoče in naravno.",
      `rooms: priporočila SAMO za te prostore, v tem vrstnem redu: ${data.rooms
        .map((r) => r.label)
        .join(
          ", ",
        )}. Za vsak prostor uporabi točno ta zapis oznake (label) in v 3–5 stavkih pojasni, čemu dati prednost, ključna funkcionalna priporočila in ideje za organizacijo. Ne dodajaj drugih prostorov.`,
      "investment: kratko pojasnilo, da gre za okvirno oceno in da bo končna ponudba pripravljena po posvetu in izmerah. Ne pojasnjuj izračuna in ne navajaj številk.",
      "nextSteps: točno trije koraki (Posvet, Izmere, Končni oblikovalski predlog), vsak z naslovom in 1–2 stavkoma.",
      "closing: en topel zaključni stavek s povabilom, da projekt nadaljujemo skupaj.",
    ].join("\n");

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({ schema: ReportSchema }),
        system: SYSTEM,
        prompt,
      });
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("Poročila trenutno ni bilo mogoče pripraviti.");
      }
      throw error;
    }
  });
