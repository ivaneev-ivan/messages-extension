import { FC, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { nextKey, translKeys } from "./consts"
import { IMessageItemList } from "./MessageList"

export interface IMessageItem {
  text: string
  index: number
  id: number
  messageList: IMessageItemList[]
  isEdit: boolean
  removeCallback: (id: number) => void
  updateCallback: (message: IMessageItemList, updateOption: boolean) => void
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function transliterate(word: string) {
  return capitalizeFirstLetter(
    word
      .toLowerCase()
      .split("")
      .map(function (char) {
        return translKeys[char] || char
      })
      .join("")
  )
}

const getNameInPage = () => {
  const name: HTMLElement | null = document.querySelector(
    "span.im-page--title-main"
  )
  const status: HTMLElement | null = document.querySelector(
    "span._im_page_peer_online"
  )
  if (status && name && name.textContent?.trim().split(" ")[0]) {
    return transliterate(name.textContent?.trim().split(" ")[0])
  }
  return null
}

function shuffle(array: Array<string>) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array.filter((value) => value !== "")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function regular_replace_callback(
  pattern: RegExp,
  callback: (message: any) => string,
  string: string
) {
  ;[...string.matchAll(pattern)].forEach((value) => {
    string = string.replace(value[0], callback(value))
  })

  return string
}

const generateMessages = (text: string) => {
  const orRegEx = /\{([^\\{}]*?)}/g
  let i = 50
  do {
    text = regular_replace_callback(
      orRegEx,
      (message: [string, string]) => {
        if (message[1].match(/\[.*?]/g)) {
          return message[0]
        }
        return shuffle(message[1].split("|"))[0]
      },
      text
    )
    text = regular_replace_callback(
      /\[\+([^\\[\]]*?)\+([^\\[\]]*?)]/g,
      (message: [string, string, string]) => {
        if (message[2].match(/\{.*?}/)) {
          return message[0]
        }
        return shuffle(message[2].split("|")).join(message[1])
      },
      text
    )
    i += 1
  } while (text.match(/\{.*}/) || (text.match(/\[.*]/) && i < 50))
  const upperCaseMatches = text.matchAll(/!!./g)
  if (upperCaseMatches !== null) {
    for (const match of upperCaseMatches) {
      text = text.replace(match[0], match[0][2].toUpperCase())
    }
  }
  return text
}

export const MessageItem: FC<IMessageItem> = ({
  text,
  id,
  isEdit,
  messageList,
  index,
  removeCallback,
  updateCallback,
}) => {
  const [inputText, setInputText] = useState(text)

  const sendMessage = (message: string, replace_name: boolean) => {
    let messageInput = null
    if (window.location.href.includes("https://vk.com/im")) {
      messageInput = document.querySelector("div.im-chat-input--text")
    } else {
      messageInput = document.activeElement
    }
    if (messageInput !== null) {
      if (message.includes("*name*")) {
        if (replace_name) {
          let name = getNameInPage()
          if (!name) {
            name = ""
          }
          message = message.replace("*name*", name)
        } else {
          message = message.replace("*name*", "")
        }
      }
      messageInput.click()
      if (messageInput.tagName == "BODY") {
        return
      }
      if (messageInput.tagName != "INPUT") {
        messageInput.textContent = message
      } else {
        messageInput.value = message
      }
      messageInput.focus()
    }
  }
  useHotkeys(
    `alt+${nextKey[index].eng},alt+${nextKey[index].ru}`,
    () => sendMessage(generateMessages(inputText), false),
    {
      enableOnContentEditable: true,
    }
  )

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <button
        disabled={isEdit}
        title={isEdit ? "Завершите процесс редактирования" : ""}
        className="bg-blue-500 w-2/12 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => sendMessage(generateMessages(inputText), false)}
      >
        alt+{nextKey[index].eng}
      </button>
      {isEdit ? (
        <textarea
          disabled={!isEdit}
          placeholder="Текст генерируемого сообщения"
          className="border px-4 py-2 h-10 w-7/12"
          onChange={(event) => {
            setInputText(event.target.value)
            updateCallback({ id: id, text: event.target.value }, true)
          }}
        >
          {inputText}
        </textarea>
      ) : (
        <select
          value={inputText}
          className="w-7/12"
          onChange={(event) => {
            setInputText(event.target.value)
            updateCallback({ id: id, text: event.target.value }, false)
          }}
        >
          {messageList.map((message) => (
            <option key={message.id} value={message.text}>
              {message.text}
            </option>
          ))}
        </select>
      )}

      <button
        className="bg-red-500 w-2/12 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-center"
        onClick={() => {
          removeCallback(id)
        }}
      >
        X
      </button>
    </div>
  )
}
