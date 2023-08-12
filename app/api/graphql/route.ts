import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
import GetDBConnection from "../../../db"
import {Database} from "sqlite";
import {randomUUID} from "crypto";
import {GraphQLError} from "graphql/error";
const db:Database = await GetDBConnection();

async function upsertNote(note) {
  //Normally we'd do some heavier validation here, but
  //as this is just a demo let's skip it.

  if(!note || !note.name || !note.note) {
    throw new GraphQLError("Invalid Input", {
      extensions: {
        code: 'BAD_USER_INPUT',
      }
    })
  }

  if(!note.id) {
    note.id = randomUUID();
  }
  await db.run(`
      INSERT INTO note (id, name, note, created_on, updated_on)
      VALUES (:id, :name, :note, DATETIME(), DATETIME())
      ON CONFLICT DO UPDATE SET name=:name, note=:note, updated_on=DATETIME()
      `, {
    ':id': note.id,
    ':name': note.name,
    ':note': note.note
  })
  return note
}

const resolvers = {

  Query: {
    note: async function (_, args) {
      const note = await db.get(
    `SELECT
            id, name, note, created_on, updated_on 
        FROM note WHERE id=:id`, {':id': args.id})
      if(!note) {
        throw new Error("Note not found")
      }
      return note
    },
    search: async function (_, args) {
      const notes = await db.all(
        `SELECT 
          id, name, note, created_on, updated_on
          FROM note
          WHERE name like :search or note like :search
          ORDER BY updated_on desc
          LIMIT 5
        `, {
          ':search': "%" + args.filter.filter + "%"
        }
      )
      return notes;
    },
    list: async function () {
      const notes = await db.all(
        `SELECT 
          id, name, note, created_on, updated_on
          FROM note
          ORDER BY updated_on desc
        `
      )
      return notes;
    }
  },
  Mutation: {
    updateNote: async function (_, {note}) {
      return upsertNote(note);
    },
    createNote: async function (_, {note}) {
      return upsertNote(note);
    },
    deleteNote: async function (_, {id}) {
      return await db.run('DELETE FROM note WHERE id=:id', {':id': id}).then(() => {
          return true;
        }
      )
    }
  }
};

const typeDefs = gql`
    type Note {
        id: String
        name: String
        note: String
        created_on: String
        updated_on: String
    }
    type NoteResponse {
        id: String
        name: String
        note: String
    }
    input NoteInput {
        id: String
        name: String!
        note: String!
    }
    input NoteFilter {
        filter: String
    }
    
    mutation updateNote($note: NoteInput!) {
        updateNote(note: $note) {
            id
            name
            note
        }
    }
    mutation createNote($note: NoteInput!) {
        createNote(note: $note) {
            id
            name
            note
        }
    }
    
    type Mutation {
        updateNote(id: String, note: NoteInput): NoteResponse
        createNote(note: NoteInput): NoteResponse
        deleteNote(id: String): Boolean
    }
    type Query {
        note(id: String): Note
        search(filter: NoteFilter): [Note]
        list: [Note]
    }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}