import Copy from '../@ui/Copy'
import Linkify from 'react-linkify'

const tagStyle = 'font-mono'
const _STATUSES = {
  success: {
    style: `text-green-600 ${tagStyle}`,
  },
  error: {
    style: `text-destructive-600 dark:text-destructive-dark-600 ${tagStyle}`,
  },
  pending: {
    style: `text-amber-600 ${tagStyle}`,
  },
}
type Status = keyof typeof _STATUSES

export type Item = {
  id: string
  code?: number
  body?: string
  headers?: string
  message?: string
  status: Status
}

type Props = {
  items: Item[]
}

const History = (props: Props) => {
  const { items } = props

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-500 hover:underline"
    >
      {text}
    </a>
  )

  return (
    <div className="h-full w-full px-6 py-4">
      <ul
        role="list"
        className="secondary-background-color h-full space-y-2 overflow-auto rounded-lg p-2"
      >
        {/*REFACTOR: list items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="background-color space-y-3 rounded-lg p-4 drop-shadow-md"
          >
            <Linkify componentDecorator={componentDecorator}>
              <div>
                <span className={`${_STATUSES[item.status].style}`}>
                  {item.status !== 'pending' ? item.code : 'PENDING...'}
                </span>
              </div>
              {item.message ? (
                <div>
                  <p className="text-sm font-light italic">{item.message}</p>
                </div>
              ) : null}
              {item.body ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400 dark:text-gray-600">
                    <p className="text-xs font-black">RESPONSE BODY</p>
                    <Copy
                      text={item.body}
                      className="text-xs transition hover:scale-125"
                    />
                  </div>
                  <code className="code whitespace-pre-wrap">{item.body}</code>
                </div>
              ) : null}
            </Linkify>
            {/*I don't think it's a good idea to show all header values here*/}
            {/*{item.headers ? (*/}
            {/*  <div>*/}
            {/*    <div className="flex justify-between items-center text-gray-400 dark:text-gray-600">*/}
            {/*      <p className="font-black text-xs">HEADERS</p>*/}
            {/*      <Copy*/}
            {/*        text={item.headers}*/}
            {/*        className="text-xs hover:scale-125 transition"*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*    <code className="code">{item.headers}</code>*/}
            {/*  </div>*/}
            {/*) : undefined}*/}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default History
