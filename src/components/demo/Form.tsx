import { useForm } from 'react-hook-form'
import Textarea from '../@ui/Textarea'
import Icon from '../@ui/Icon'
import Tooltip from '../@ui/Tooltip'

export type Input = {
  body: string
}

type Props = {
  shouldReset?: boolean
  onSubmit: (input: Input) => Promise<boolean>
}

const Form = (props: Props) => {
  const { shouldReset } = props
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { isValid, errors },
  } = useForm<Input>({
    defaultValues: {
      body: '{}',
    },
  })

  const onSubmit = async (input) => {
    const ret = await props.onSubmit(input)
    if (ret && shouldReset) {
      reset()
    }
  }

  const body = watch('body')
  const format = () => {
    try {
      const data = JSON.parse(body)
      setValue('body', JSON.stringify(data, undefined, 2))
    } catch (e) {}
  }
  const formatShortcut = (e) => {
    if (e.key === 'f' && e.metaKey && e.shiftKey) {
      format()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-4 h-full flex flex-col space-y-4"
    >
      {/*Editor*/}
      <div className="grow rounded-lg secondary-background-color relative">
        {/*Header*/}
        <div className="w-full h-[44px] bg-transparent flex justify-end items-center border-b border-color px-4">
          <div className="flex items-center space-x-2">
            <Tooltip text="cmd + shift + f" className="!bg-sky-500">
              <button
                type="button"
                onClick={format}
                disabled={!isValid}
                className="
                p-1 rounded-lg disabled:opacity-25
                enabled:hover:bg-gray-100 enabled:dark:hover:bg-gray-700
                "
              >
                <Icon variant="code" className="w-[20px] h-[20px]" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/*Text Input*/}
        <Textarea
          {...register('body', {
            required: true,
            validate: (body?: string) => {
              // Oops...Do I have to handle errors by myself??
              clearErrors('body')
              if (body) {
                try {
                  JSON.parse(body)
                  return true
                } catch (e) {
                  setError('body', { type: 'format', message: e.message })
                }
              }
              return false
            },
          })}
          aria-invalid={errors.body ? 'true' : 'false'}
          onKeyDown={formatShortcut}
          className="
          resize-none w-full h-[calc(100%-44px)] px-4 pb-4 pt-2 bg-transparent rounded-b-lg
          font-mono text-sm
          "
        />

        {/*Error message*/}
        {errors.body?.message && (
          <div
            className="
          absolute left-[8px] bottom-[8px] w-[calc(100%-16px)] p-1 rounded-lg flex justify-center items-center
          bg-destructive-500 dark:bg-destructive-dark-500
          "
          >
            <p className="text-white font-mono text-sm">
              {errors.body.message}
            </p>
          </div>
        )}
      </div>

      {/*Submit Button*/}
      <div className="flex justify-center items-center">
        <button
          type="submit"
          disabled={!isValid}
          className="
          px-3 py-1 rounded-lg border disabled:opacity-25
          text-sm font-semibold text-color border-color
          enabled:hover:bg-gray-100 enabled:dark:hover:bg-gray-700
          enabled:transition enabled:transform enabled:hover:scale-125
          "
        >
          Send
        </button>
      </div>
    </form>
  )
}

export default Form