import { type SubmissionResult, useForm } from "@conform-to/react"
import {
  type DataTag,
  type DefaultError,
  type MutationFunction,
  type MutationState,
  type QueryKey,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query"
import { parseWithValibot } from "conform-to-valibot"
import { useMemo } from "react"
import * as v from "valibot"

export function mutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return options
}

export function usePendingMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const state = useMutationState<
    MutationState<TData, TError, TVariables, TContext>
  >({
    filters: {
      mutationKey: options.mutationKey,
      status: "pending",
    },
  })

  return state[state.length - 1]
}

type OptimisticProps<
  TData = unknown,
  TVariables = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TQueryFnData = unknown,
> = {
  mutationFn: MutationFunction<TData, TVariables>
  queryKey: TQueryKey
  updater: Updater<TQueryFnData, TVariables>
}

type Updater<TQueryFnData, TVariables> = (
  oldData: TQueryFnData | undefined,
  variables: TVariables,
) => TQueryFnData | undefined

export function useOptimisticMutation<
  TData = unknown,
  TVariables = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TInferredQueryFnData = TQueryKey extends DataTag<
    unknown,
    infer TaggedValue,
    unknown
  >
    ? TaggedValue
    : unknown,
>({
  mutationFn,
  queryKey,
  updater,
}: OptimisticProps<TData, TVariables, TQueryKey, TInferredQueryFnData>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey })

      const snapshot = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<TInferredQueryFnData>(queryKey, (old) =>
        updater(old, variables),
      )

      return () => {
        queryClient.setQueryData(queryKey, snapshot)
      }
    },
    onError(_error, _variables, rollback) {
      rollback?.()
    },
  })
}

const SubmissionResultObject = v.object({
  status: v.union([v.literal("error"), v.literal("success")]),
})

const SubmissionResult = v.custom<SubmissionResult>((value) =>
  v.is(SubmissionResultObject, value),
)

type FormOptions<Schema extends v.GenericSchema<Record<string, unknown>>> =
  Parameters<typeof useForm<v.InferInput<Schema>, v.InferOutput<Schema>>>[0]

export function useFormMutation<
  Schema extends v.GenericSchema<Record<string, unknown>>,
  Mutation extends UseMutationResult<unknown, DefaultError, FormData, unknown>,
>({
  schema,
  mutation,
  ...options
}: FormOptions<Schema> & { schema: Schema; mutation: Mutation }) {
  const lastResult = useMemo(
    () => (v.is(SubmissionResult, mutation.error) ? mutation.error : undefined),
    [mutation.error],
  )

  return useForm<v.InferInput<Schema>, v.InferOutput<Schema>>({
    ...options,
    lastResult,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema,
      })
    },
    onSubmit(event, context) {
      event.preventDefault()
      mutation.mutate(context.formData)
    },
  })
}

export function usePendingFormMutation<
  Schema extends v.GenericSchema,
  TData = unknown,
  TError = DefaultError,
  TContext = unknown,
>({
  mutation,
  schema,
}: {
  mutation: UseMutationOptions<TData, TError, FormData, TContext>
  schema: Schema
}) {
  const pending = usePendingMutation(mutation)

  if (!pending?.variables) return undefined

  const parsed = parseWithValibot(pending.variables, {
    schema,
  })

  if (parsed.status !== "success") {
    if (process.env.NODE_ENV === "development") {
      throw Error("Caught invalidated form mutation")
    }

    return undefined
  }

  return parsed.value
}
