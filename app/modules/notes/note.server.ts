import type { User, Note } from '@prisma/client'

import { prisma } from '@/db.server'

export type { Note } from '@prisma/client'

export function getNote({
  id,
  userId,
}: Pick<Note, 'id'> & {
  userId: User['id']
}) {
  return prisma.note.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  })
}

export function getNoteListItems({ userId }: { userId: User['id'] }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export function createNote({
  title,
  summary,
  body,
  userId,
}: Pick<Note, 'body' | 'title' | 'summary'> & {
  userId: User['id']
}) {
  return prisma.note.create({
    data: {
      title,
      summary,
      body,
      user: {
        connect: { id: userId },
      },
    },
  })
}

export function deleteNote({ id, userId }: Pick<Note, 'id'> & { userId: User['id'] }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  })
}
