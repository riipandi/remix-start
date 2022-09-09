import type { PrismaClient, User } from '@prisma/client'

const notes = [
  {
    title: 'Hello World 1',
    summary: 'This is my first note',
    body: 'Lorem ipsum dolor sit amet euismod laoreet eget lacus. Suspendisse vestibulum nostra lectus aliquet posuere elementum. Nascetur taciti posuere ac elementum senectus amet iaculis erat.',
  },
  {
    title: 'Hello World 2',
    summary: 'This is my second note',
    body: 'Lorem ipsum dolor sit amet euismod laoreet eget lacus. Suspendisse vestibulum nostra lectus aliquet posuere elementum. Nascetur taciti posuere ac elementum senectus amet iaculis erat.',
  },
  {
    title: 'Hello World 3',
    summary: 'This is my third note',
    body: 'Lorem ipsum dolor sit amet euismod laoreet eget lacus. Suspendisse vestibulum nostra lectus aliquet posuere elementum. Nascetur taciti posuere ac elementum senectus amet iaculis erat.',
  },
]

export const SampleNoteSeeder = async (prisma: PrismaClient, user: User) => {
  return notes.map(async (note) => {
    return await prisma.note.create({
      data: { ...note, userId: user.id },
    })
  })
}
