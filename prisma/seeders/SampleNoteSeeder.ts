import type { PrismaClient, User } from '@prisma/client'

const notes = [
  {
    title: 'Hello World',
    body: 'This is my first note',
  },
  {
    title: 'Hello World 2',
    body: 'This is my second note',
  },
  {
    title: 'Hello World 3',
    body: 'This is my third note',
  },
]

export const SampleNoteSeeder = async (prisma: PrismaClient, user: User) => {
  return notes.map(async (note) => {
    return await prisma.note.create({
      data: { ...note, userId: user.id },
    })
  })
}
