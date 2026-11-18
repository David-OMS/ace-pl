import { writeFile } from "node:fs/promises";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true })],
  });
}

function subheading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true })],
  });
}

function body(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun(text)],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [new TextRun(`• ${text}`)],
  });
}

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.TITLE,
          spacing: { after: 200 },
          children: [new TextRun({ text: "ACE PL Fantasy", bold: true, size: 36 })],
        }),
        body("Rules that catch people out. Read these before you lock a squad."),

        heading("Deadline"),
        body("Every Thursday at 23:59. Your squad for that Friday’s gameweek locks then."),

        heading("Before the first deadline"),
        body(
          "You can start your team from scratch as many times as you want up until the first deadline. Change formation, swap the whole squad, rebuild completely. Money from removals goes back to your bank.",
        ),

        heading("After the first deadline"),

        subheading("Transfers"),
        bullet("You get 1 free transfer each gameweek."),
        bullet(
          "An unused free transfer does not roll over to the next week. If you don’t use it, it’s gone.",
        ),
        bullet(
          "After you’ve used that free transfer, each extra transfer costs you −5 of your points.",
        ),
        body("Example: 1 transfer = free. 2 transfers = −5 points. 3 transfers = −10 points."),

        subheading("Starter ↔ bench swaps"),
        body(
          "Moving someone from the bench into the starting XI (and the other way) is free and does not count as a transfer — but only if both players are the same position. You can only swap position for position.",
        ),
        body(
          "Example: a MID on the bench can swap with a MID starter. A MID cannot swap with a DEF.",
        ),

        subheading("Buying a player (transfer in)"),
        body(
          "When you transfer players, you can only bring someone in if you can afford them.",
        ),
        body(
          "Afford means: money in your bank + what you get back for the player going out must cover the full price of the player coming in.",
        ),
        body("Example:"),
        bullet("Bank = ₦2.0m"),
        bullet("Player out sells for ₦8.0m"),
        bullet("You have ₦10.0m to spend"),
        bullet("You can bring in anyone priced ₦10.0m or less"),
        bullet("You cannot bring in someone priced ₦10.5m"),

        subheading("Formation"),
        body(
          "You can only change formation if the players already in your squad can fill every spot.",
        ),
        body(
          "Example: you want 3 midfielders, but you only have 2 mids in the whole squad (starters + bench) → you can’t pick that formation until you transfer in another MID.",
        ),

        heading("Gameweek points"),
        body(
          "A gameweek is one Friday. A player’s points that week are from all their matches that day, added up.",
        ),

        heading("Captain and vice"),
        body("Captain’s points are doubled."),
        body(
          "If the captain does not play at all that gameweek, the vice-captain’s points are doubled instead — but only if the vice played.",
        ),

        heading("Auto-subs"),
        body("This is checked once for the whole gameweek, not match by match."),
        body(
          "If an outfield starter does not play at all that Friday, they are replaced by the first bench outfielder who did play.",
        ),
        body(
          "If two outfield starters don’t play, the second bench outfielder can come in too — only if that sub also played.",
        ),
        body(
          "Your goalkeeper never auto-subs. If your GK doesn’t play that gameweek, those points are lost.",
        ),

        heading("Team name"),
        body(
          "Must be unique in this tournament. After you create the team, you can rename it at most twice.",
        ),
      ],
    },
  ],
});

const outPath = new URL("../docs/ACE-PL-Fantasy-Rules.docx", import.meta.url);
const buffer = await Packer.toBuffer(doc);
await writeFile(outPath, buffer);
console.log(`Wrote ${outPath.pathname}`);
