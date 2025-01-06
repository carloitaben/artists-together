import * as v from "valibot"
import { TransactionRollbackError } from "drizzle-orm"
import type { SQLiteTransactionConfig } from "drizzle-orm/sqlite-core"
import { AsyncContextInvariantError, createContext } from "../context"
import { assert } from "../types"
import { database } from "./client"

export type Transaction = Parameters<
  Parameters<typeof database.transaction>[0]
>[0]

const TransactionContext = createContext<{
  tx: Transaction
  effects: (() => void | Promise<void>)[]
}>()

type CreateTransactionConfig = SQLiteTransactionConfig & {
  signal?: AbortSignal
}

/**
 * Returns the current transaction or a database instance.
 * Useful for composition.
 *
 * ```ts
 * async function reusableFunction() {
 *   return useTransaction((tx) => {
 *     await tx
 *       .update(accounts)
 *       .set({ balance: sql`${accounts.balance} + 100.00` })
 *       .where(eq(users.name, 'Andrew'))
 *   })
 * }
 *
 * await createTransaction(async (tx) => {
 *   await tx
 *     .update(accounts)
 *     .set({ balance: sql`${accounts.balance} - 100.00` })
 *     .where(eq(users.name, 'Dan'))
 *
 *   await reusableFunction()
 * })
 * ```
 * ```
 */
export function useTransaction<T>(
  callback: (
    transactionOrDatabase: Transaction | typeof database,
  ) => Promise<T>,
) {
  try {
    const context = TransactionContext.use()
    return callback(context.tx)
  } catch (error) {
    assert(v.instance(AsyncContextInvariantError), error)
    return callback(database)
  }
}

/**
 * Creates a side-effect that will run after a transaction completes.
 *
 * ```ts
 * await createTransaction(async (tx) => {
 *   await tx
 *     .update(accounts)
 *     .set({ balance: sql`${accounts.balance} - 100.00` })
 *     .where(eq(users.name, 'Dan'))
 *
 *   await afterTransaction(() => {
 *     console.log("Updated Dan balance")
 *   })
 * })
 * ```
 */
export async function afterTransaction(effect: () => any | Promise<any>) {
  try {
    const context = TransactionContext.use()
    context.effects.push(effect)
  } catch (error) {
    assert(v.instance(AsyncContextInvariantError), error)
    await effect()
  }
}

/**
 * Creates a composable, abortable transaction.
 *
 * ```ts
 * const controller = new AbortController()
 *
 * await createTransaction(
 *   async (tx) => {
 *     await tx
 *       .update(accounts)
 *       .set({ balance: sql`${accounts.balance} - 100.00` })
 *       .where(eq(users.name, 'Dan'))
 *     await tx
 *       .update(accounts)
 *       .set({ balance: sql`${accounts.balance} + 100.00` })
 *       .where(eq(users.name, 'Andrew'))
 *   },
 *   { signal: controller.signal }
 * )
 * ```
 */
export async function createTransaction<T>(
  callback: (tx: Transaction) => Promise<T>,
  { signal, ...config }: CreateTransactionConfig = {},
) {
  try {
    const context = TransactionContext.use()
    return callback(context.tx)
  } catch (error) {
    assert(v.instance(AsyncContextInvariantError), error)

    const effects: (() => void | Promise<void>)[] = []

    const result = await database.transaction(async (tx) => {
      await new Promise((resolve, reject) => {
        if (signal) {
          signal.addEventListener("abort", async () => {
            reject(new TransactionRollbackError())
          })
        }

        return resolve(
          TransactionContext.run({ tx, effects }, () => callback(tx)),
        )
      })
    }, config)

    await Promise.all(effects.map((effect) => effect()))

    return result
  }
}
