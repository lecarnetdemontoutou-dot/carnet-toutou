import { prisma } from "@/lib/db/client";

export type BingoCellData = { text: string; points: number };
export type BingoState = {
  cells: BingoCellData[];
  checks: Record<number, string[]>;
  notified: boolean;
};

const DEFAULT_CELLS: BingoCellData[] = [
  { text: "A dansé sur une table (ou a failli)", points: 15 },
  { text: "A raconté une anecdote d'enfance d'Oriane", points: 10 },
  { text: "A pris un selfie avec Oriane", points: 5 },
  { text: "A fait un discours improvisé", points: 15 },
  { text: "A chanté \"Joyeux anniversaire\" complètement faux", points: 10 },
  { text: "A dit \"on ne change pas, toi\" à Oriane", points: 5 },
  { text: "A offert un cadeau fait maison", points: 10 },
  { text: "A proposé un toast", points: 10 },
  { text: "A montré une vieille photo d'Oriane", points: 10 },
  { text: "A pleuré (de rire ou d'émotion)", points: 15 },
  { text: "A apporté un cadeau en double avec quelqu'un d'autre", points: 20 },
  { text: "A goûté le gâteau avant tout le monde", points: 10 },
  { text: "A fait un jeu de mots vraiment nul", points: 5 },
  { text: "A parlé de sa première rencontre avec Oriane", points: 10 },
  { text: "A pris une photo de groupe", points: 5 },
  { text: "A dansé un slow", points: 10 },
  { text: "A dit \"le temps passe trop vite\"", points: 5 },
  { text: "A souhaité un truc improbable à Oriane pour l'an prochain", points: 15 },
  { text: "A renversé quelque chose", points: 20 },
  { text: "A fait crier tout le monde \"surprise !\"", points: 20 },
];

async function ensureSeeded() {
  const count = await prisma.bingoCell.count();
  if (count === 0) {
    await prisma.bingoCell.createMany({
      data: DEFAULT_CELLS.map((c, index) => ({ index, text: c.text, points: c.points })),
    });
  }
  await prisma.bingoMeta.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
}

export async function getState(): Promise<BingoState> {
  await ensureSeeded();
  const [cellRows, checkRows, meta] = await Promise.all([
    prisma.bingoCell.findMany({ orderBy: { index: "asc" } }),
    prisma.bingoCheck.findMany(),
    prisma.bingoMeta.findUniqueOrThrow({ where: { id: "singleton" } }),
  ]);

  const cells = cellRows.map((c) => ({ text: c.text, points: c.points }));
  const checks: Record<number, string[]> = {};
  for (const row of checkRows) {
    (checks[row.cellIndex] ??= []).push(row.name);
  }

  return { cells, checks, notified: meta.notified };
}

export async function toggleCheck(index: number, name: string): Promise<BingoState> {
  const existing = await prisma.bingoCheck.findUnique({
    where: { cellIndex_name: { cellIndex: index, name } },
  });
  if (existing) {
    await prisma.bingoCheck.delete({ where: { id: existing.id } });
  } else {
    await prisma.bingoCheck.create({ data: { cellIndex: index, name } });
  }
  return getState();
}

export async function updateCells(cells: BingoCellData[]): Promise<BingoState> {
  await Promise.all(
    cells.map((c, index) =>
      prisma.bingoCell.upsert({
        where: { index },
        create: { index, text: c.text, points: c.points },
        update: { text: c.text, points: c.points },
      })
    )
  );
  return getState();
}

export async function resetChecks(): Promise<BingoState> {
  await prisma.bingoCheck.deleteMany();
  await prisma.bingoMeta.update({ where: { id: "singleton" }, data: { notified: false } });
  return getState();
}

export async function markNotified(): Promise<{ alreadyNotified: boolean }> {
  const result = await prisma.bingoMeta.updateMany({
    where: { id: "singleton", notified: false },
    data: { notified: true },
  });
  return { alreadyNotified: result.count === 0 };
}
